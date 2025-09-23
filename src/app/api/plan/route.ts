import { NextResponse } from "next/server";
import { User } from "@/models/user";
import { auth } from "@/auth";
import connectDB from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "user") {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 403 }
      );
    }

    await connectDB();

    const user = await User.findById(session.user._id).populate("plan");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!user.plan) {
      return NextResponse.json({
        message: "No active plan found",
        plan: null,
      });
    }

    const planName =
      user.plan && typeof user.plan === "object" && "name" in user.plan
        ? (user.plan as { name: string }).name
        : null;

    const totalSearches =
      user.plan && typeof user.plan === "object" && "searchesLimit" in user.plan
        ? (user.plan as { searchesLimit: number }).searchesLimit
        : null;

    const planDetails = {
      name: planName,
      planActivatedAt: user.planActivatedAt,
      planEndsAt: user.planEndsAt,
      remainingDays: user.planEndsAt
        ? Math.max(
            0,
            Math.ceil(
              (new Date(user.planEndsAt).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24)
            )
          )
        : null,
      totalSearches: totalSearches,
      remainingSearches:
        user.plan &&
        typeof user.plan === "object" &&
        "searchesLimit" in user.plan
          ? (user.plan as { searchesLimit: number }).searchesLimit -
            user.usedSearches
          : null,
    };

    return NextResponse.json({ plan: planDetails });
  } catch (err) {
    console.error("Error fetching current plan:", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
