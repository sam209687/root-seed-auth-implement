// src/app/api/auth/send-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { generateOTP } from "../../../../lib/utils"; // We'll create this utility
import { otpStore, OTP_EXPIRY_SECONDS } from "../../../../lib/constants";
import { auth } from "../../../../lib/auth"; // For session verification

const resend = new Resend(process.env.RESEND_API_KEY);
const RESEND_EMAIL_FROM = process.env.RESEND_EMAIL_FROM || "onboarding@resend.dev";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user || !session.user.isDefaultAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { email } = await req.json();

  if (!email || session.user.email !== email) {
    return NextResponse.json({ message: "Invalid email or unauthorized request." }, { status: 400 });
  }

  const otp = generateOTP();
  const expiry = Date.now() + OTP_EXPIRY_SECONDS * 1000; // OTP valid for 5 minutes

  otpStore.set(email, { code: otp, expiry });
  console.log(`Generated OTP for ${email}: ${otp}`); // For debugging

  try {
    await resend.emails.send({
      from: RESEND_EMAIL_FROM,
      to: email,
      subject: "Your POS System Password Reset OTP",
      html: `<p>Your One-Time Password (OTP) for changing your POS System password is: <strong>${otp}</strong></p><p>This code is valid for ${OTP_EXPIRY_SECONDS / 60} minutes.</p>`,
    });

    return NextResponse.json({ message: "OTP sent successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ message: "Failed to send OTP email." }, { status: 500 });
  }
}