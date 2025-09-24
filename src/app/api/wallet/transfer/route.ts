import { NextRequest, NextResponse } from "next/server";

import { Wallet } from "@/models/wallet";
import { auth } from "@/auth";
import connectDB from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (
      !session ||
      (session.user.role !== "reseller" && session.user.role !== "admin")
    ) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 403 }
      );
    }

    const { fromId, fromModel, toId, toModel, amount, by } = await req.json();

    if (!fromId || !fromModel || !toId || !toModel || !amount || !by) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const fromWallet = await Wallet.findOne({
      ownerId: fromId,
      ownerModel: fromModel,
    });
    const toWallet = await Wallet.findOne({
      ownerId: toId,
      ownerModel: toModel,
    });

    if (!fromWallet || !toWallet)
      return NextResponse.json(
        { message: "Wallet not found" },
        { status: 404 }
      );
    if (fromWallet.balance < amount)
      return NextResponse.json(
        { message: "Insufficient balance" },
        { status: 400 }
      );

    await fromWallet.debit(amount, `Transferred to ${toModel} ${toId}`, by);
    await toWallet.credit(amount, by, `Received from ${fromModel} ${fromId}`);

    return NextResponse.json({
      success: true,
      fromBalance: fromWallet.balance,
      toBalance: toWallet.balance,
    });
  } catch (err) {
    console.error("Error transfer:", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
