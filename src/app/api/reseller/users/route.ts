import { NextRequest, NextResponse } from "next/server";

import { Plan } from "@/types/enums";
import { PlanModel } from "@/models/plan";
import { User } from "@/models/user";
import { Wallet } from "@/models/wallet";
import { auth } from "@/auth";
import connectDB from "@/lib/db";
import mongoose from "mongoose";
import { sendEmail } from "@/lib/resend";

// Create new user by reseller
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "reseller") {
      return NextResponse.json(
        { message: "Unauthorized. Reseller access required." },
        { status: 403 }
      );
    }

    await connectDB();

    const { fullname, username, email, phone, password, currency } =
      await req.json();

    if (!fullname || !username || !email || !password || !currency) {
      return NextResponse.json(
        {
          message:
            "Fullname, Username, Email, Password, and Currency are required.",
        },
        { status: 400 }
      );
    }

    // check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists." },
        { status: 409 }
      );
    }

    const resellerId = session.user._id;

    if (!resellerId) {
      return NextResponse.json(
        { message: "Reseller ID not found in session." },
        { status: 400 }
      );
    }

    // ✅ fetch FREE_TRIAL plan
    const freeTrialPlan = await PlanModel.findOne({ name: Plan.TRIAL });
    if (!freeTrialPlan) {
      return NextResponse.json(
        { message: "Free Trial plan not found. Please seed plans first." },
        { status: 500 }
      );
    }

    // ✅ calculate trial dates
    const now = new Date();
    const endsAt = new Date(now);
    endsAt.setDate(now.getDate() + (freeTrialPlan.durationDays || 7));

    const user = new User({
      fullname,
      username,
      email: email.toLowerCase(),
      phone,
      password,
      currency,
      avatar: `https://ui-avatars.com/api/?background=009689&color=fff&name=${encodeURIComponent(
        fullname
      )}`,
      resellerId,
      provider: "credentials",
      isVerified: true,
      plan: freeTrialPlan._id,
      planActivatedAt: now,
      planEndsAt: endsAt,
    });

    const wallet = await Wallet.create({
      ownerId: user._id,
      ownerModel: "User",
      balance: 0,
      currency,
      transactions: [],
    });

    user.walletId = wallet._id as mongoose.Types.ObjectId;
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Your account has been approved!",
      templateName: "userApproved",
      data: {
        name: user.fullname,
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully!",
        userId: user._id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating user:", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}

// Get all users of a reseller
export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "reseller") {
      return NextResponse.json(
        { message: "Unauthorized. Reseller access required." },
        { status: 403 }
      );
    }

    await connectDB();
    const resellerId = session.user._id;

    // Get all users with wallet balance
    const users = await User.find({ resellerId })
      .populate({ path: "plan", select: "name" })
      .populate({ path: "walletId", select: "balance currency" })
      .lean();

    return NextResponse.json({ users }, { status: 200 });
  } catch (err) {
    console.error("Error fetching reseller's users:", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
