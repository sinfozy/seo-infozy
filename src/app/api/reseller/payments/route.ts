import { NextRequest, NextResponse } from "next/server";

import { Payment } from "@/models/payment";
import { Reseller } from "@/models/reseller";
import { User } from "@/models/user";
import { auth } from "@/auth";
import connectDB from "@/lib/db";

export async function GET(req: NextRequest) {
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

    if (!resellerId || typeof resellerId !== "string") {
      return NextResponse.json(
        { message: "Reseller ID not found in session." },
        { status: 400 }
      );
    }

    // Find all users belonging to this reseller
    const users = await User.find({ resellerId }).select("_id fullname").lean();
    const userIds = users.map((u) => u._id.toString());

    // Fetch all payments made by those users
    const payments = await Payment.find({
      ownerModel: "User",
      ownerId: { $in: userIds },
    })
      .sort({ createdAt: -1 })
      .lean();

    // Map userId -> name for easy lookup
    const userMap = users.reduce(
      (acc, u) => {
        acc[u._id.toString()] = u.fullname;
        return acc;
      },
      {} as Record<string, string>
    );

    const response = payments.map((p) => ({
      _id: p._id,
      ownerId: p.ownerId,
      ownerModel: p.ownerModel,
      ownerName: userMap[p.ownerId.toString()] || "",
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      razorpay_order_id: p.razorpay_order_id,
      razorpay_payment_id: p.razorpay_payment_id || null,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return NextResponse.json(response);
  } catch (err) {
    console.error("Error fetching reseller payments:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
