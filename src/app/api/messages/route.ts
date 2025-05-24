// src/app/api/messages/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/db'; // Your existing DB connection
import { Message, MessageStatus, MessageType } from '../../../lib/models/Message'; // Your new message model
import { ObjectId } from 'mongodb'; // Import ObjectId

const COLLECTION_NAME = 'offline_messages'; // A new collection for messages

// GET all messages
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const messages = await db.collection<Message>(COLLECTION_NAME)
                            .find({})
                            .sort({ timestamp: -1 }) // Latest first
                            .toArray();
    return NextResponse.json(messages);
  } catch (error) {
    console.error('API Error fetching messages:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new message (e.g., OTP Request from Cashier)
export async function POST(request: Request) {
  try {
    const { type, senderId, senderName, recipientId, otp, timestamp, status } = await request.json();

    // Basic validation
    if (!type || !senderId) {
      return NextResponse.json({ message: 'Missing required message fields' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const messagesCollection = db.collection<Message>(COLLECTION_NAME);

    const newMessage: Message = {
      type,
      senderId,
      senderName,
      recipientId,
      otp,
      timestamp: timestamp || new Date().toISOString(), // Use provided or current
      status: status || MessageStatus.Pending,
      createdAt: new Date(),
      // For OTP requests, set an expiry for security
      expiresAt: type === MessageType.OtpRequest ? new Date(Date.now() + 5 * 60 * 1000) : undefined, // 5 minutes for OTP request
    };

    const result = await messagesCollection.insertOne(newMessage);
    return NextResponse.json({ ...newMessage, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('API Error adding message:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT to update a message (e.g., Admin sends OTP response)
export async function PUT(request: Request) {
  try {
    const { id, status, otp, recipientId } = await request.json(); // 'id' from the request body

    if (!id || !status) {
      return NextResponse.json({ message: 'Missing message ID or status' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const messagesCollection = db.collection<Message>(COLLECTION_NAME);

    const updateFields: Partial<Message> = { status, updatedAt: new Date() };
    if (otp) {
      updateFields.otp = otp;
      // Set expiry for OTP response if it's an OTP_RESPONSE
      updateFields.expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes
    }
    if (recipientId) {
      updateFields.recipientId = recipientId;
    }


    const result = await messagesCollection.updateOne(
      { _id: new ObjectId(id) }, // Convert string id to ObjectId
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Message not found' }, { status: 404 });
    }

    const updatedMessage = await messagesCollection.findOne({ _id: new ObjectId(id) });

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error('API Error updating message:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}