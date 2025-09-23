import { NextRequest, NextResponse } from "next/server";

import { getJson } from "serpapi";

export interface GoogleData {
  title?: string;
  address?: string;
  phone?: string;
  links?: {
    website?: string;
  };
  email?: string;
  social_links?: string[];
  rating?: string;
  reviews?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, location } = body;

    if (!query || !location) {
      return NextResponse.json(
        { error: "Query and location are required" },
        { status: 400 }
      );
    }

    // Call SerpApi
    const serpResponse = await getJson({
      engine: "google",
      q: query,
      location,
      hl: "en",
      gl: "us",
      api_key: process.env.SERPAPI_KEY,
    });

    // Extract local business results safely
    const localResults = serpResponse.local_results || [];

    const results: GoogleData[] = localResults["places"].map(
      (biz: GoogleData) => {
        return {
          title: biz.title || "",
          address: biz.address || "",
          phone: biz.phone || "",
          links: { website: biz.links?.website || "" },
          email: biz.email || "",
          rating: biz.rating || "",
          reviews: biz.reviews || "",
        };
      }
    );

    return NextResponse.json(results);
  } catch (err) {
    console.error("Error fetching business data:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
