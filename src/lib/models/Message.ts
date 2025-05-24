// src/lib/models/Message.ts
import { ObjectId } from 'mongodb';

export enum MessageType {
  OtpRequest = 'OTP_REQUEST',
  OtpResponse = 'OTP_RESPONSE',
  // Add other message types as needed
}

export enum MessageStatus {
  Pending = 'pending',
  Generated = 'generated', // For OTP request - admin generated OTP
  Delivered = 'delivered', // For OTP response - cashier received OTP
  Used = 'used', // OTP used for password change
  Expired = 'expired',
}

export interface Message {
  _id?: ObjectId;
  type: MessageType;
  senderId: string; // User ID (e.g., cashierId or adminId)
  senderName?: string; // Optional name of the sender
  recipientId?: string; // User ID of the recipient (e.g., cashierId for OTP_RESPONSE)
  otp?: string; // The generated OTP (for OTP_RESPONSE)
  timestamp: string; // ISO string of when message was created
  status: MessageStatus;
  expiresAt?: Date; // For OTP messages to expire
  createdAt?: Date;
  updatedAt?: Date;
}