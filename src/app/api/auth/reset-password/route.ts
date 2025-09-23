import { NextRequest, NextResponse } from "next/server";

import { User } from "@/models/user";
import connectDB from "@/lib/db";
import { sendEmail } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const { token, password, email } = await req.json();

    if (!token || !password || !email) {
      return NextResponse.json(
        { error: "Token, email, and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user with matching reset token and check expiry
    const user = await User.findOne({
      email: email.toLowerCase(),
      "resetPassword.token": token,
      "resetPassword.expiresAt": { $gt: new Date() }, // check expiry
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    user.password = password;

    // Invalidate reset token after use
    user.resetPassword = { token: undefined, expiresAt: undefined };

    await user.save();

    // Send confirmation email
    await sendEmail({
      to: user.email,
      subject: "Password Reset Successful",
      templateName: "passwordResetSuccess",
      data: { name: user.fullname },
    });

    return NextResponse.json(
      { message: "Password reset successful" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Reset Password Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
