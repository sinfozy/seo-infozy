import { NextRequest, NextResponse } from "next/server";

import { Payment } from "@/models/payment";
import { Wallet } from "@/models/wallet";
import { auth } from "@/auth";
import connectDB from "@/lib/db";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const {
      ownerId,
      ownerModel,
      amount,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = await req.json();

    if (
      !ownerId ||
      !ownerModel ||
      !amount ||
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    // Step 1: Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { message: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Step 2: Find the Payment document
    const payment = await Payment.findOne({
      razorpay_order_id,
      ownerId,
      ownerModel,
    });
    if (!payment) {
      return NextResponse.json(
        { message: "Payment record not found" },
        { status: 404 }
      );
    }

    if (payment.status === "paid") {
      return NextResponse.json({ success: true, message: "Already processed" });
    }

    // Step 3: Update payment status
    payment.status = "paid";
    payment.razorpay_payment_id = razorpay_payment_id;
    payment.razorpay_signature = razorpay_signature;
    await payment.save();

    // Step 4: Credit Wallet
    const wallet = await Wallet.findOne({ ownerId, ownerModel });
    if (!wallet) {
      return NextResponse.json(
        { message: "Wallet not found" },
        { status: 404 }
      );
    }

    await wallet.credit(
      amount,
      session.user._id,
      `Wallet recharge via Razorpay (Payment ID: ${razorpay_payment_id})`
    );

    return NextResponse.json({ success: true, balance: wallet.balance });
  } catch (err) {
    console.error("Error verifying payment:", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
