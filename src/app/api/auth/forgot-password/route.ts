// src/app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User, UserRole } from '@/lib/models/User';
import crypto from 'crypto'; // For generating OTP
import { Resend } from 'resend'; // Import Resend

const resend = new Resend(process.env.RESEND_API_KEY);
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'; // Use your verified email or default

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection<User>('users');

    const user = await usersCollection.findOne({ email });

    if (!user) {
      // For security, always return a generic message to prevent email enumeration
      return NextResponse.json(
        { message: 'If an account with that email exists, a password reset OTP has been sent.' },
        { status: 200 }
      );
    }

    // Generate OTP (6-digit number)
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // Store OTP and its expiration in the user document
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { otp, otpExpires } }
    );

    // --- Send OTP Email using Resend ---
    try {
      const { data, error } = await resend.emails.send({
        from: `Root & Seed POS <${RESEND_FROM_EMAIL}>`, // Use your verified domain/email
        to: [user.email],
        subject: 'Root & Seed POS - Password Reset OTP',
        html: `
          <p>Hello ${user.name || user.email},</p>
          <p>Your One-Time Password (OTP) for resetting your password is: <strong>${otp}</strong></p>
          <p>This OTP is valid for the next 10 minutes. Do not share it with anyone.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
          <p>Thank you,</p>
          <p>The Root & Seed POS Team</p>
        `,
      });

      if (error) {
        console.error('Error sending email:', error);
        // Do not expose email sending error to the user for security reasons
        return NextResponse.json(
          { message: 'If an account with that email exists, a password reset OTP has been sent.' },
          { status: 200 }
        );
      }

      console.log('OTP Email sent successfully:', data);

    } catch (emailError) {
      console.error('An unexpected error occurred while sending email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send OTP email. Please try again later.' },
        { status: 500 }
      );
    }

    // Respond with success message and indicate redirection needed
    return NextResponse.json(
      { 
        message: 'A password reset OTP has been sent to your email. Please check your inbox (and spam folder).',
        redirect: true, // Signal client to redirect
        email: user.email // Pass email for the reset page
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password API error:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}