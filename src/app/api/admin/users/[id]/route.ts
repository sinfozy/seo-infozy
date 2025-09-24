import { NextRequest, NextResponse } from "next/server";

import { User } from "@/models/user";
import { Wallet } from "@/models/wallet";
import { auth } from "@/auth";
import connectDB from "@/lib/db";
import { sendEmail } from "@/lib/resend";

// GET user by ID - Admin only
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
    const userId = (await params).id;

    // Fetch user with plan populated
    const user = await User.findById(userId)
      .populate({
        path: "plan",
        select: "name price searchesLimit",
      })
      .populate({
        path: "walletId",
        select: "balance",
      });
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "User fetched successfully!",
        user,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching user:", err);
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
    const userId = (await params).id;

    const body = await req.json();
    const { fullname, username, email, phone, isActive, notes } = body;

    // Find User
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Update user fields only if provided
    if (fullname !== undefined) user.fullname = fullname;
    if (username !== undefined) user.username = username;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (isActive !== undefined) user.isActive = isActive;
    if (notes !== undefined) user.notes = notes;

    await user.save();

    const emailResponse = await sendEmail({
      to: user.email,
      subject: "Your account has been updated",
      templateName: "updatedUserDetails",
      data: {
        name: user.fullname,
      },
    });

    if (!emailResponse.success) {
      console.error("Error sending updated user details email:", emailResponse);
    }

    return NextResponse.json(
      {
        message: "User updated successfully!",
        user,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating user:", err);
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
  const userId = (await params).id;

  try {
    await connectDB();

    const user = await User.findByIdAndDelete(userId);
    await Wallet.findOneAndDelete({ ownerId: userId, ownerModel: "User" });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete user" },
      { status: 500 }
    );
  }
}
