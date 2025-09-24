import { NextRequest, NextResponse } from "next/server";

import { User } from "@/models/user";
import { auth } from "@/auth";
import connectDB from "@/lib/db";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
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
    const { isActive } = await req.json();

    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        { message: "Invalid request. isActive must be a boolean." },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    user.isActive = isActive;
    await user.save();

    return NextResponse.json(
      {
        message: `User account has been ${isActive ? "activated" : "deactivated"} successfully.`,
        userId: user._id,
        isActive: user.isActive,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating user status:", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
