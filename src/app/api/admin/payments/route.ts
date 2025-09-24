import { NextResponse } from "next/server";
import { Payment } from "@/models/payment";
import { Reseller } from "@/models/reseller";
import { User } from "@/models/user";
import { auth } from "@/auth";
import connectDB from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    await connectDB();

    const payments = await Payment.find().sort({ createdAt: -1 }).lean();

    // Bulk fetch owners
    const userIds = payments
      .filter((p) => p.ownerModel === "User")
      .map((p) => p.ownerId.toString());
    const resellerIds = payments
      .filter((p) => p.ownerModel === "Reseller")
      .map((p) => p.ownerId.toString());

    const users = await User.find({ _id: { $in: userIds } })
      .select("_id fullname")
      .lean();
    const resellers = await Reseller.find({ _id: { $in: resellerIds } })
      .select("_id companyName")
      .lean();

    const userMap = users.reduce(
      (acc, u) => {
        acc[u._id.toString()] = u.fullname;
        return acc;
      },
      {} as Record<string, string>
    );

    const resellerMap = resellers.reduce(
      (acc, r) => {
        acc[r._id.toString()] = r.companyName;
        return acc;
      },
      {} as Record<string, string>
    );

    const response = payments.map((p) => {
      const ownerName =
        p.ownerModel === "User"
          ? userMap[p.ownerId.toString()] || ""
          : resellerMap[p.ownerId.toString()] || "";

      return {
        _id: p._id,
        ownerId: p.ownerId,
        ownerModel: p.ownerModel,
        ownerName,
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        razorpay_order_id: p.razorpay_order_id,
        razorpay_payment_id: p.razorpay_payment_id || null,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      };
    });

    return NextResponse.json(response);
  } catch (err) {
    console.error("Error fetching payments:", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
