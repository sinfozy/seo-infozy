import { NextRequest, NextResponse } from "next/server";

import { User } from "@/models/user";
import { auth } from "@/auth";
import connectDB from "@/lib/db";

// Get all users of a reseller
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    await connectDB();
    const resellerId = (await params).id;

    // Get all users with plan details
    const users = await User.find({ resellerId })
      .populate({ path: "plan", select: "name" })
      .populate({
        path: "walletId",
        select: "balance currency",
      })
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
