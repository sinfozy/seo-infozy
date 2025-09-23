import { NextRequest, NextResponse } from "next/server";

import { Plan } from "@/types/enums";
import { PlanModel } from "@/models/plan";
import { User } from "@/models/user";
import { Wallet } from "@/models/wallet";
import connectDB from "@/lib/db";
import { limiter } from "@/lib/rate-limit";
import mongoose from "mongoose";
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

    const { fullname, username, email, password, currency } = await req.json();

    if (!fullname || !username || !email || !password || !currency) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() },
      ],
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    const ipinfoRes = await fetch(
      `https://ipinfo.io/lite/me?token=${process.env.IPINFO_TOKEN}`
    );

    if (!ipinfoRes.ok) {
      console.log("Error fetching IP info:", ipinfoRes.statusText);
    }
    const ipinfo = await ipinfoRes.json();

    const user = new User({
      fullname,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      avatar: `https://ui-avatars.com/api/?background=009689&color=fff&name=${encodeURIComponent(
        fullname
      )}`,
      location: ipinfo,
      currency,
    });

    const { code } = user.generateOtp();
    await user.save();

    const wallet = await Wallet.create({
      ownerId: user._id,
      ownerModel: "User",
      balance: 0,
      currency,
      transactions: [],
    });

    const freeTrialPlan = await PlanModel.findOne({ name: Plan.TRIAL });

    if (freeTrialPlan) {
      const now = new Date();
      const endsAt = new Date(now);
      endsAt.setDate(now.getDate() + (freeTrialPlan.durationDays || 7));

      user.plan = freeTrialPlan._id as mongoose.Types.ObjectId;
      user.planActivatedAt = now;
      user.planEndsAt = endsAt;

      user.walletId = wallet._id as mongoose.Types.ObjectId;

      await user.save();
    }

    // Send OTP email
    const res = await sendEmail({
      to: user.email,
      subject: "Your OTP Code",
      templateName: "verifyEmailOtp",
      data: {
        name: fullname,
        otp: code,
        verifyUrl: `${process.env.NEXT_PUBLIC_AUTH_URL}/verify-email?email=${user.email}`,
      },
    });

    if (!res.success) {
      console.error("Error sending OTP email:", res.message);
      return NextResponse.json(
        { message: "Error sending OTP email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Signup Successful! OTP sent for verification.",
        userId: user._id,
        email: user.email,
      },
      { status: 201 }
    );
  } catch (err) {
    console.log("Error signup:", err);

    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
