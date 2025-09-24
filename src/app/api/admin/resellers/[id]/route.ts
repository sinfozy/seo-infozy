import { NextRequest, NextResponse } from "next/server";

import { Reseller } from "@/models/reseller";
import { Wallet } from "@/models/wallet";
import { auth } from "@/auth";
import connectDB from "@/lib/db";

// GET reseller by ID - Admin only
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

    const reseller = await Reseller.findById(resellerId).populate({
      path: "walletId",
      select: "balance currency",
    });
    if (!reseller) {
      return NextResponse.json(
        { message: "Reseller not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Reseller fetched successfully!",
        reseller,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching reseller:", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    const body = await req.json();
    const { fullname, email, phone, companyName, isActive, notes } = body;

    // Find reseller
    const reseller = await Reseller.findById(resellerId);
    if (!reseller) {
      return NextResponse.json(
        { message: "Reseller not found." },
        { status: 404 }
      );
    }

    // Update fields only if provided
    if (fullname !== undefined) reseller.fullname = fullname;
    if (email !== undefined) reseller.email = email;
    if (phone !== undefined) reseller.phone = phone;
    if (companyName !== undefined) reseller.companyName = companyName;
    if (isActive !== undefined) reseller.isActive = isActive;
    if (notes !== undefined) reseller.notes = notes;

    await reseller.save();

    return NextResponse.json(
      { message: "Reseller updated successfully.", reseller },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating reseller:", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resellerId = (await params).id;

  try {
    await connectDB();

    const reseller = await Reseller.findById(resellerId);
    if (!reseller) {
      return NextResponse.json(
        { message: "Reseller not found" },
        { status: 404 }
      );
    }

    await Reseller.findByIdAndDelete(resellerId);
    await Wallet.findOneAndDelete({
      ownerId: reseller._id,
      ownerModel: "Reseller",
    });

    return NextResponse.json({
      message: "Reseller deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete reseller" },
      { status: 500 }
    );
  }
}
