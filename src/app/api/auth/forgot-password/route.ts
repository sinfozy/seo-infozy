import { NextRequest, NextResponse } from "next/server";

import { User } from "@/models/user";
import connectDB from "@/lib/db";
import crypto from "crypto";
import { limiter } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const { success } = await limiter.limit("global");
    if (!success) {
      return NextResponse.json(
        { message: "Too many requests, try again later." },
        { status: 429 }
      );
    }

    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // Generate secure reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetPassword = {
        token: resetToken,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
      };
      await user.save();

      // Send reset email
      const res = await sendEmail({
        to: user.email,
        subject: "Reset Your Password",
        templateName: "resetPassword",
        data: {
          name: user.fullname,
          resetUrl: `${process.env.NEXT_PUBLIC_AUTH_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`,
        },
      });

      if (!res.success) {
        console.error("Error sending reset password email:", res.message);
      }
    }

    // Always return success response (prevents user enumeration)
    return NextResponse.json(
      {
        message:
          "If an account exists, you’ll receive a password reset email shortly.",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error forgot password:", err);
    return NextResponse.json(
      { message: "Error processing request" },
      { status: 500 }
    );
  }
}
