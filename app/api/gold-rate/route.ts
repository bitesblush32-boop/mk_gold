import { NextResponse } from "next/server";
import { fetchGoldRate } from "@/lib/gold-rate";

// ISR: revalidate every 5 minutes
export const revalidate = 300;

export async function GET() {
  try {
    const rate = await fetchGoldRate();
    return NextResponse.json(rate, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (err) {
    console.error("[api/gold-rate] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch gold rate" },
      { status: 500 }
    );
  }
}
