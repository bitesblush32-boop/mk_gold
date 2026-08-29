import { NextRequest, NextResponse } from "next/server";
import { createLead } from "@/lib/db/leads";
import type { Lead } from "@/db/schema";

/* ─── CORS headers (fully public) ───────────────────────────────── */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/* ─── Google Sheets sync (reused from internal route) ───────────── */

function sourceLabel(source: string): string {
  const s = source.toLowerCase();
  if (s === "whatsapp") return "WhatsApp";
  if (s === "crm") return "CRM";
  if (s === "referral") return "Referral";
  if (s === "campaign") return "Campaign";
  if (s === "chatbot") return "AI Chatbot";
  return `External: ${source}`;
}

async function syncLeadToSheets(lead: Lead): Promise<void> {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url) return;

  const ist = new Date(lead.created_at).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });
  const istDate = new Date(lead.created_at).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
  });

  const payload = JSON.stringify({
    date: istDate,
    created_time: ist,
    name: lead.name,
    phone: lead.phone,
    city: lead.city ?? "",
    area: lead.area ?? "",
    gold_type: lead.gold_type ?? "",
    weight: lead.weight_grams ?? "",
    purity: lead.purity_karat ? `${lead.purity_karat}K` : "",
    email: lead.email ?? "",
    notes: lead.notes ?? "",
    channel: sourceLabel(lead.source),
  });

  const postOptions: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
  };

  try {
    const res = await fetch(url, { ...postOptions, redirect: "manual" });
    let finalRes: Response;
    if ([301, 302, 307, 308].includes(res.status)) {
      const location = res.headers.get("location");
      if (!location) return;
      finalRes = await fetch(location, postOptions);
    } else {
      finalRes = res;
    }
    if (!finalRes.ok) {
      const text = await finalRes.text().catch(() => "");
      console.error("[v1/leads sheets-sync] HTTP error:", finalRes.status, text.slice(0, 200));
    }
  } catch (err) {
    console.error("[v1/leads sheets-sync] failed:", err);
  }
}

/* ─── Simple in-memory rate limiter (60 req/min per IP) ─────────── */

interface RateEntry {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateEntry>();
const RATE_LIMIT = 60;
const WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

/* ─── OPTIONS — preflight ────────────────────────────────────────── */

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/* ─── POST /api/v1/leads — public, no auth required ─────────────── */

export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: CORS_HEADERS },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  const {
    name,
    phone,
    email,
    city,
    area,
    branch_slug,
    gold_type,
    weight_grams,
    purity_karat,
    estimated_value,
    notes,
    source = "external-api",
    source_page,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
  } = body as Record<string, string | number | undefined>;

  /* ── Validation ─────────────────────────────────────────────────── */

  if (!name || !phone) {
    return NextResponse.json(
      { error: "name and phone are required" },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  const cleanPhone = String(phone).replace(/\s/g, "");
  if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
    return NextResponse.json(
      { error: "Enter a valid 10-digit Indian mobile number" },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  /* ── Persist ────────────────────────────────────────────────────── */

  try {
    const lead = await createLead({
      name: String(name),
      phone: cleanPhone,
      email: email ? String(email) : undefined,
      city: city ? String(city) : undefined,
      area: area ? String(area) : undefined,
      branch_slug: branch_slug ? String(branch_slug) : undefined,
      gold_type: gold_type ? String(gold_type) : undefined,
      weight_grams: weight_grams != null ? String(weight_grams) : undefined,
      purity_karat: purity_karat != null ? Number(purity_karat) : undefined,
      estimated_value:
        estimated_value != null ? String(estimated_value) : undefined,
      notes: notes ? String(notes) : undefined,
      source: String(source),
      source_page: source_page ? String(source_page) : undefined,
      utm_source: utm_source ? String(utm_source) : undefined,
      utm_medium: utm_medium ? String(utm_medium) : undefined,
      utm_campaign: utm_campaign ? String(utm_campaign) : undefined,
      utm_content: utm_content ? String(utm_content) : undefined,
      status: "new",
    });

    // Sync to Google Sheets (non-blocking)
    syncLeadToSheets(lead).catch(() => {});

    return NextResponse.json(
      { success: true, id: lead.id },
      { status: 201, headers: CORS_HEADERS },
    );
  } catch (err) {
    console.error("[api/v1/leads] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: CORS_HEADERS },
    );
  }
}
