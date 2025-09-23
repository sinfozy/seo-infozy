import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    if (!q) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    const res = await fetch(
      `https://serpapi.com/locations.json?q=${encodeURIComponent(q)}`
    );
    const data = await res.json();

    // Return only the locations array
    return NextResponse.json(data || []);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}
