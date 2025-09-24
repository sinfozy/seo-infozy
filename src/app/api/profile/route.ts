import { NextRequest, NextResponse } from "next/server";

import { User } from "@/models/user";
import { auth } from "@/auth";
import connectDB from "@/lib/db";
import { limiter } from "@/lib/rate-limit";
import { z } from "zod";

// Validation schema
const updateProfileSchema = z.object({
  fullname: z.string().min(2).max(100).optional(),
  username: z.string().min(3).max(50).optional(),
  phone: z.string().min(6).max(20).optional(),
});

// GET Profile
export async function GET(req: NextRequest) {
  try {
    const { success } = await limiter.limit("profile_get");
    if (!success) {
      return NextResponse.json(
        { message: "Too many requests, try again later." },
        { status: 429 }
      );
    }

    const session = await auth();
    if (!session?.user?._id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user._id)
      .select(
        "username fullname email phone avatar isVerified plan planActivatedAt planEndsAt currency resellerId usedSearches aiConversations createdAt"
      )
      .populate({ path: "plan", select: "name price" })
      .populate({ path: "resellerId", select: "name" })
      .lean();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.error("Error fetching profile:", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}

// PUT Profile
export async function PUT(req: NextRequest) {
  try {
    const { success } = await limiter.limit("profile_put");
    if (!success) {
      return NextResponse.json(
        { message: "Too many requests, try again later." },
        { status: 429 }
      );
    }

    const session = await auth();
    if (!session?.user?._id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      const errorTree = z.treeifyError(parsed.error);
      return NextResponse.json({ message: errorTree }, { status: 400 });
    }

    const { fullname, username, phone } = parsed.data;

    await connectDB();

    type UpdateFields = {
      fullname?: string;
      username?: string;
      phone?: string;
    };

    const updateFields: UpdateFields = {};
    if (fullname !== undefined) updateFields.fullname = fullname;
    if (username !== undefined) updateFields.username = username;
    if (phone !== undefined) updateFields.phone = phone;

    await User.updateOne({ _id: session.user._id }, { $set: updateFields });

    return NextResponse.json(
      { message: "Profile updated successfully!" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating profile:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
