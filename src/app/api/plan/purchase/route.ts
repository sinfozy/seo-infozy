import { NextRequest, NextResponse } from "next/server";

import { Plan } from "@/types/enums";
import { PlanModel } from "@/models/plan";
import { User } from "@/models/user";
import { Wallet } from "@/models/wallet";
import { auth } from "@/auth";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

function isValidPlan(planName: string): boolean {
  return Object.values(Plan).includes(planName as Plan);
}

function canUpgrade(currentPlan: string, targetPlanName: string): boolean {
  const planRank = {
    [Plan.TRIAL]: 0,
    [Plan.MONTHLY]: 1,
    [Plan.THREE_MONTHS]: 2,
    [Plan.SIX_MONTHS]: 3,
    [Plan.YEARLY]: 4,
  };

  const currentPlanName = currentPlan;

  if (
    currentPlanName &&
    planRank[targetPlanName as Plan] <= planRank[currentPlanName as Plan]
  ) {
    return false;
  }
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "user") {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 403 }
      );
    }

    const userId = session.user._id;
    const { planName } = await req.json();

    if (!isValidPlan(planName)) {
      return NextResponse.json(
        { message: "Invalid plan selected" },
        { status: 400 }
      );
    }

    await connectDB();

    // Fetch user
    const user = await User.findById(userId).populate("plan");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Fetch target plan
    const plan = await PlanModel.findOne({ name: planName });
    if (!plan) {
      return NextResponse.json({ message: "Plan not found" }, { status: 404 });
    }

    // Fetch wallet
    const wallet = await Wallet.findOne({
      ownerId: userId,
      ownerModel: "User",
    });
    if (!wallet) {
      return NextResponse.json(
        { message: "Wallet not found" },
        { status: 404 }
      );
    }

    // Upgrade logic: only allow upgrading to higher tier
    if (user.plan) {
      const currentPlanName =
        typeof user.plan === "object" && "name" in user.plan
          ? (user.plan.name as string)
          : null;

      if (currentPlanName && !canUpgrade(currentPlanName, planName)) {
        return NextResponse.json(
          { message: "You can only upgrade to a higher plan" },
          { status: 400 }
        );
      }
    }

    // Deduct balance
    try {
      await wallet.debit(
        plan.price,
        `Plan purchase: ${planName}`,
        userId.toString()
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        return NextResponse.json({ message: err.message }, { status: 400 });
      }
      return NextResponse.json(
        { message: "Unknown error occurred" },
        { status: 400 }
      );
    }

    // Update user subscription
    const newExpiry = new Date();
    newExpiry.setDate(newExpiry.getDate() + plan.durationDays);

    user.plan = new mongoose.Types.ObjectId(plan._id as string);
    user.planActivatedAt = new Date();
    user.planEndsAt = newExpiry;
    user.usedSearches = 0;

    await user.save();

    return NextResponse.json({
      message: `Plan ${planName} purchased successfully`,
      plan: plan.name,
      planEndsAt: user.planEndsAt,
      walletBalance: wallet.balance,
    });
  } catch (err) {
    console.error("Error purchasing plan:", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
