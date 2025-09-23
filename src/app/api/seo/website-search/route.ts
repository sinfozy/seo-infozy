import { NextRequest, NextResponse } from "next/server";

import { getJson } from "serpapi";

// import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    // const session = await auth();
    // if (!session) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    // }

    const { searchParams } = new URL(req.url);
    const domain = searchParams.get("domain");

    if (!domain) {
      return NextResponse.json(
        { error: "Domain is required" },
        { status: 400 }
      );
    }

    const serpResponse = await getJson({
      engine: "google",
      q: `site:${domain}`,
      api_key: process.env.SERPAPI_KEY,
    });

    return NextResponse.json(serpResponse.organic_results || []);
  } catch (err) {
    console.error("Error wallet fetch:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
