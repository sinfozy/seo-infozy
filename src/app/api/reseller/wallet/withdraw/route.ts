import { NextRequest, NextResponse } from "next/server";

import { Wallet } from "@/models/wallet";
import { auth } from "@/auth";
import connectDB from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const { ownerId, ownerModel, amount } = await req.json();

    if (!ownerId || !ownerModel || amount <= 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const wallet = await Wallet.findOne({ ownerId, ownerModel });
    if (!wallet)
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });

    if (wallet.balance < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    await wallet.debit(Number(amount), "Admin withdrawal", session.user._id);

    return NextResponse.json({ success: true, balance: wallet.balance });
  } catch (err) {
    console.error("Error wallet withdrawal:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
