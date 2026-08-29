import { NextRequest, NextResponse } from "next/server";
import { getGoldRateOverride } from "@/lib/db/rates";

/* ─── CORS (public, read-only) ───────────────────────────────────── */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/* ─── OPTIONS preflight ──────────────────────────────────────────── */

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/* ─── GET /api/v1/calculate
 *
 * Query params:
 *   weight  — weight in grams (required, numeric, e.g. 10 or 10.5)
 *   purity  — karat value: 24 | 22 | 20 | 18 (required)
 *
 * Example:
 *   GET /api/v1/calculate?weight=10&purity=22
 *
 * Response (200):
 *   {
 *     weight_grams   : 10,
 *     purity_karat   : 22,
 *     rate_per_gram  : 6850,        ← live MK rate for that karat
 *     mk_value       : 66787,       ← what MK pays (97.5% of rate × weight)
 *     estimate_low   : 65451,       ← -2% branch variation
 *     estimate_high  : 68123,       ← +2% branch variation
 *     mcx_rate_10g   : 76500,       ← MCX reference (24K per 10g)
 *     rate_24k       : 7650,        ← 24K per gram
 *     rate_22k       : 7010,        ← 22K per gram
 *     updated_at     : "2026-08-29T10:00:00.000Z",
 *     currency       : "INR",
 *     note           : "Exact value confirmed at branch after certified XRF test."
 *   }
 *
 * ─── MK's pricing logic (same as MkCalculator.tsx) ──────────────
 *   MK pays 97.5% of the MCX-linked admin rate.
 *   estimate_low  = mk_value × 0.98   (−2% branch variation)
 *   estimate_high = mk_value × 1.02   (+2% branch variation)
 * ─────────────────────────────────────────────────────────────────── */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  /* ── Parse & validate ────────────────────────────────────────── */

  const weightRaw = searchParams.get("weight");
  const purityRaw = searchParams.get("purity");

  if (!weightRaw || !purityRaw) {
    return NextResponse.json(
      { error: "Both 'weight' (grams) and 'purity' (karat: 24|22|20|18) are required" },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  const weight = parseFloat(weightRaw);
  const purity = parseInt(purityRaw, 10);

  if (isNaN(weight) || weight <= 0 || weight > 10000) {
    return NextResponse.json(
      { error: "'weight' must be a positive number (max 10000 grams)" },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  if (![24, 22, 20, 18].includes(purity)) {
    return NextResponse.json(
      { error: "'purity' must be one of: 24, 22, 20, 18" },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  /* ── Fetch live rates from DB (same source as the website) ───── */

  let override = null;
  try {
    override = await getGoldRateOverride();
  } catch {
    // DB not ready
  }

  if (!override || !override.is_manual) {
    return NextResponse.json(
      { error: "Gold rates not available right now. Please try again shortly." },
      { status: 503, headers: CORS_HEADERS },
    );
  }

  const rate24k = Number(override.rate_24k); // per gram
  const rate22k = Number(override.rate_22k);
  const rate20k = Number(override.rate_20k);
  const rate18k = Number(override.rate_18k);

  const rateMap: Record<number, number> = {
    24: rate24k,
    22: rate22k,
    20: rate20k,
    18: rate18k,
  };

  const ratePerGram = rateMap[purity];

  /* ── Calculate (matches MkCalculator.tsx logic exactly) ─────── */

  // MK pays 97.5% of MCX-linked rate
  const mkValue = Math.round(ratePerGram * weight * 0.975);
  const estimateLow = Math.round(mkValue * 0.98);   // −2% branch variation
  const estimateHigh = Math.round(mkValue * 1.02);  // +2% branch variation

  const updatedAt =
    override.updated_at instanceof Date
      ? override.updated_at.toISOString()
      : String(override.updated_at);

  return NextResponse.json(
    {
      weight_grams: weight,
      purity_karat: purity,
      rate_per_gram: ratePerGram,
      mk_value: mkValue,
      estimate_low: estimateLow,
      estimate_high: estimateHigh,
      mcx_rate_10g: Math.round(rate24k * 10),
      rate_24k: rate24k,
      rate_22k: rate22k,
      updated_at: updatedAt,
      currency: "INR",
      note: "Exact value confirmed at branch after certified XRF test.",
    },
    {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        "Cache-Control": "no-store",
      },
    },
  );
}
