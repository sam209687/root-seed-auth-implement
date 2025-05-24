// src/app/api/admin/change-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/db";
import { User } from "../../../../lib/models/User";
import bcrypt from "bcrypt";
import { otpStore } from "../../../../lib/constants";
import { ObjectId } from "mongodb";
import { auth } from "../../../../lib/auth"; // For session verification

export async function POST(req: NextRequest) {
  const session = await auth();
  // Ensure only the authenticated default admin can change their password via this route
  if (!session || !session.user || session.user.role !== "admin" || !session.user.isDefaultAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { email, newPassword, otp } = await req.json();

  if (!email || !newPassword || !otp) {
    return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
  }

  // 1. Verify OTP
  const storedOtpData = otpStore.get(email);
  if (!storedOtpData || storedOtpData.code !== otp || Date.now() > storedOtpData.expiry) {
    return NextResponse.json({ message: "Invalid or expired OTP." }, { status: 400 });
  }

  // Remove OTP after successful verification (or failed attempts)
  otpStore.delete(email);

  // 2. Hash New Password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // 3. Update Password in MongoDB
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection<User>("users");

    const updateResult = await usersCollection.updateOne(
      { email: email, isDefaultAdmin: true }, // Ensure we target the default admin
      {
        $set: {
          password: hashedPassword,
          isDefaultAdmin: false, // Mark as no longer default after changing password
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ message: "User not found or not default admin." }, { status: 404 });
    }
    if (updateResult.modifiedCount === 0) {
      return NextResponse.json({ message: "Password not updated. It might be the same as the old one or an internal error occurred." }, { status: 500 });
    }

    return NextResponse.json({ message: "Password updated successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error updating password in DB:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}