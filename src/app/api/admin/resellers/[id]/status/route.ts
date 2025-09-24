import { NextRequest, NextResponse } from "next/server";

import { Reseller } from "@/models/reseller";
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

    const resellerId = (await params).id;
    const { isActive } = await req.json();

    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        { message: "Invalid request. isActive must be a boolean." },
        { status: 400 }
      );
    }

    const reseller = await Reseller.findById(resellerId);

    if (!reseller) {
      return NextResponse.json(
        { message: "Reseller not found." },
        { status: 404 }
      );
    }

    reseller.isActive = isActive;
    await reseller.save();

    return NextResponse.json(
      {
        message: `Reseller account has been ${isActive ? "activated" : "deactivated"} successfully.`,
        resellerId: reseller._id,
        isActive: reseller.isActive,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating reseller status:", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
