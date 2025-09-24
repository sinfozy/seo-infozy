import { NextRequest, NextResponse } from "next/server";

import { Wallet } from "@/models/wallet";
import { auth } from "@/auth";
import connectDB from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    await connectDB();

    const { adminId, amount } = await req.json();

    if (!adminId || amount <= 0) {
      return NextResponse.json(
        { message: "Invalid admin ID or amount" },
        { status: 400 }
      );
    }

    const wallet = await Wallet.findOne({
      ownerId: adminId,
      ownerModel: "Admin",
    });
    if (!wallet)
      return NextResponse.json({ message: "Wallet not found" }, { status: 404 });

    await wallet.credit(
      amount,
      session.user._id,
      "Self recharge via payment gateway"
    );

    return NextResponse.json({ success: true, balance: wallet.balance });
  } catch (err) {
    console.error("Error wallet recharge:", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
