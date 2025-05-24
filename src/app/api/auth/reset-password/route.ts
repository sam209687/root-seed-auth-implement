// src/app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/lib/models/User';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const { email, otp, newPassword } = await request.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: 'Email, OTP, and new password are required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection<User>('users');

    // 1. Find user by email and OTP
    const user = await usersCollection.findOne({ email, otp });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or OTP.' }, { status: 400 });
    }

    // 2. Check if OTP has expired
    if (user.otpExpires && new Date() > user.otpExpires) {
      // Clear expired OTP to prevent reuse
      await usersCollection.updateOne(
        { _id: user._id },
        { $unset: { otp: '', otpExpires: '' } }
      );
      return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
    }

    // 3. Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update password and clear OTP fields
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword }, $unset: { otp: '', otpExpires: '' } }
    );

    return NextResponse.json(
      { message: 'Password has been reset successfully. You can now log in with your new password.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Reset password API error:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}