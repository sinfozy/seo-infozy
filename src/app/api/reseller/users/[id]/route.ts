import { NextRequest, NextResponse } from "next/server";

import { User } from "@/models/user";
import { auth } from "@/auth";
import connectDB from "@/lib/db";

// GET user by ID - Reseller only
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "reseller") {
      return NextResponse.json(
        { message: "Unauthorized. Reseller access required." },
        { status: 403 }
      );
    }

    await connectDB();
    const userId = (await params).id;

    const user = await User.findOne({
      _id: userId,
      resellerId: session.user._id,
    })
      .populate({ path: "plan", select: "name" })
      .populate({ path: "walletId", select: "balance currency" })
      .select("-notes");

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

// Update user by reseller
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "reseller") {
      return NextResponse.json(
        { message: "Unauthorized. Reseller access required." },
        { status: 403 }
      );
    }

    await connectDB();
    const userId = (await params).id;

    const body = await req.json();
    const { fullname, username, email, phone, password } = body;

    // Find User
    const user = await User.findOne({
      _id: userId,
      resellerId: session.user._id,
    });
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Update fields only if provided
    if (fullname !== undefined) user.fullname = fullname;
    if (username !== undefined) user.username = username;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (password !== undefined) user.password = password;

    await user.save();

    return NextResponse.json(
      { message: "User updated successfully.", user },
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
