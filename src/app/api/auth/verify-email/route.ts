import { NextRequest, NextResponse } from "next/server";

import { User } from "@/models/user";
import connectDB from "@/lib/db";
import { sendEmail } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Find account with email
    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+otp.code +otp.expiresAt");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Validate OTP
    const isValid = user.validateOtp(code);
    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Mark account as verified
    user.isVerified = true;
    user.otp = { code: undefined, expiresAt: undefined }; // clear OTP
    await user.save();

    // Send OTP email
    const res = await sendEmail({
      to: user.email,
      subject: "Welcome to AI Infozy",
      templateName: "welcome",
      data: {
        name: user.fullname,
      },
    });

    if (!res.success) {
      console.error("Error sending welcome email:", res.message);
      return NextResponse.json(
        { message: "Error sending welcome email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Email verified successfully!" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error verifying account:", err);
    return NextResponse.json(
      { message: "Error verifying account" },
      { status: 500 }
    );
  }
}
