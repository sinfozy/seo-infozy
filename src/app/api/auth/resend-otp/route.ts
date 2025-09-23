import { NextRequest, NextResponse } from "next/server";

import { User } from "@/models/user";
import connectDB from "@/lib/db";
import { sendEmail } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Generate new OTP
    const { code } = user.generateOtp();
    await user.save();

    // Send OTP email
    await sendEmail({
      to: user.email,
      subject: "Your OTP Code",
      templateName: "verifyEmailOtp",
      data: {
        name: user.fullname,
        otp: code,
        verifyUrl: `${process.env.NEXT_PUBLIC_AUTH_URL}/verify-email?email=${user.email}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
