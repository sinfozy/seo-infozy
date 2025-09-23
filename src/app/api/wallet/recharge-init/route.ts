import { NextRequest, NextResponse } from "next/server";

import { Currency } from "@/types/enums";
import { Payment } from "@/models/payment";
import Razorpay from "razorpay";
import { Wallet } from "@/models/wallet";
import { auth } from "@/auth";
import connectDB from "@/lib/db";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { ownerId, ownerModel, amount } = await req.json();

    if (!ownerId || !ownerModel || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const wallet = await Wallet.findOne({ ownerId, ownerModel });
    if (!wallet)
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });

    const shortOwnerId = ownerId.toString().slice(-6);
    const receipt = `w-${shortOwnerId}-${Date.now()}`;

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: Currency.INR,
      receipt,
      payment_capture: true,
    });

    // Save Payment in DB
    await Payment.create({
      ownerId,
      ownerModel,
      amount,
      currency: Currency.INR,
      razorpay_order_id: order.id,
      status: "created",
    });

    return NextResponse.json({
      success: true,
      order: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      },
    });
  } catch (err) {
    console.error("Error wallet recharge:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
