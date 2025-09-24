import { NextRequest, NextResponse } from "next/server";

import { Reseller } from "@/models/reseller";
import { Wallet } from "@/models/wallet";
import { auth } from "@/auth";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

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

    const {
      fullname,
      companyName,
      email,
      phone,
      password,
      currency,
      isActive,
      notes,
    } = await req.json();

    if (!fullname || !companyName || !email || !password || !currency) {
      return NextResponse.json(
        {
          message:
            "Fullname, Company Name, Email, Password, and Currency are required.",
        },
        { status: 400 }
      );
    }

    // check if reseller already exists
    const existingReseller = await Reseller.findOne({
      $or: [{ email: email.toLowerCase() }, { companyName }],
    });

    if (existingReseller) {
      return NextResponse.json(
        { message: "Reseller already exists." },
        { status: 409 }
      );
    }

    // create reseller
    const reseller = new Reseller({
      fullname,
      companyName,
      email: email.toLowerCase(),
      phone,
      password,
      currency,
      avatar: `https://ui-avatars.com/api/?background=009689&color=fff&name=${encodeURIComponent(
        fullname
      )}`,
      isActive,
      notes,
    });

    const wallet = await Wallet.create({
      ownerId: reseller._id,
      ownerModel: "Reseller",
      balance: 0,
      currency,
      transactions: [],
    });

    reseller.walletId = wallet._id as mongoose.Types.ObjectId;
    await reseller.save();

    return NextResponse.json(
      {
        message: "Reseller created successfully!",
        resellerId: reseller._id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating reseller:", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}

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

    // Get all resellers with wallet balance
    const resellers = await Reseller.find()
      .populate({ path: "walletId", select: "balance currency" })
      .lean();

    return NextResponse.json({ resellers }, { status: 200 });
  } catch (err) {
    console.error("Error fetching resellers:", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
