import { NextRequest, NextResponse } from "next/server";

import { User } from "@/models/user";
import { auth } from "@/auth";
import { getJson } from "serpapi";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user._id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const user = await User.findById(session.user._id);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }
    if (!(await user.canUseWebsiteSearch())) {
      return NextResponse.json(
        { message: "You have reached your search limit." },
        { status: 403 }
      );
    }
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get("domain");

    if (!domain) {
      return NextResponse.json(
        { message: "Domain is required" },
        { status: 400 }
      );
    }

    const serpResponse = await getJson({
      engine: "google",
      q: `site:${domain}`,
      api_key: process.env.SERPAPI_KEY,
    });

    user.incrementWebsiteSearch(domain);
    await user.save();

    return NextResponse.json(serpResponse.organic_results || []);
  } catch (err) {
    console.error("Error wallet fetch:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
