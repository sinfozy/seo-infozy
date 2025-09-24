import { NextRequest, NextResponse } from "next/server";

import { Currency } from "@/types/enums";
import { Reseller } from "@/models/reseller";
import { User } from "@/models/user";
import { Wallet } from "@/models/wallet";
import { auth } from "@/auth";
import connectDB from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ownerId: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const ownerModel = searchParams.get("ownerModel") as
      | "User"
      | "Admin"
      | "Reseller";

    if (!ownerModel) {
      return NextResponse.json(
        { message: "ownerModel query param is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const ownerId = (await params).ownerId;
    const wallet = await Wallet.findOne({ ownerId, ownerModel });

    if (!wallet) {
      return NextResponse.json(
        { message: "Wallet not found" },
        { status: 404 }
      );
    }

    // Conversion rate
    const USD_TO_INR = Number(process.env.USD_RATE);
    if (isNaN(USD_TO_INR) || USD_TO_INR <= 0) {
      return NextResponse.json(
        { message: "USD_RATE environment variable is not set or invalid." },
        { status: 500 }
      );
    }

    // Current wallet currency
    let balance = wallet.balance;
    let currency = wallet.currency || Currency.INR;

    // Convert transactions and sort newest first
    const transactions = wallet.transactions
      .map((tx) => {
        let amount = tx.amount;
        if (currency === "USD") {
          amount = Number((amount / USD_TO_INR).toFixed(2));
        } else {
          amount = Number(amount.toFixed(2));
        }
        return {
          amount,
          type: tx.type,
          description: tx.description,
          createdAt: tx.createdAt,
          by: tx.by,
        };
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    // Convert balance
    if (currency === Currency.USD) {
      balance = Number((balance / USD_TO_INR).toFixed(2));
    } else {
      balance = Number(balance.toFixed(2));
      currency = Currency.INR;
    }

    // Build clean response object
    return NextResponse.json({
      _id: wallet._id,
      ownerId: wallet.ownerId,
      ownerModel: wallet.ownerModel,
      balance,
      currency,
      transactions,
    });
  } catch (err) {
    console.error("Error wallet fetch:", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
