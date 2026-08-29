import { NextRequest, NextResponse } from "next/server";
import { createLead } from "@/lib/db/leads";
import type { Lead } from "@/db/schema";

/* ─── Meta Lead Ads Webhook ──────────────────────────────────────────
 *
 * How Meta Lead Ads work:
 * 1. You create a lead form inside Facebook/Instagram Ads Manager.
 * 2. You subscribe your Page to the "leadgen" webhook in Meta for Developers.
 * 3. When someone submits the in-app form, Meta calls:
 *      GET  (to verify the webhook — one-time setup)
 *      POST (every new lead)
 *
 * Required env vars:
 *   META_VERIFY_TOKEN  — any secret string you choose (set same in Meta dashboard)
 *   META_APP_SECRET    — from Meta App Settings → Basic → App Secret (for signature check)
 *   META_PAGE_ACCESS_TOKEN — Page Access Token with `leads_retrieval` permission
 *
 * ─────────────────────────────────────────────────────────────────── */

/* ─── Google Sheets sync (same as other routes) ─────────────────── */

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
    channel: "Meta Lead Ad",
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
      console.error("[meta-leads sheets-sync] error:", finalRes.status, text.slice(0, 200));
    }
  } catch (err) {
    console.error("[meta-leads sheets-sync] failed:", err);
  }
}

/* ─── Fetch full lead fields from Meta Graph API ─────────────────── */

interface MetaLeadFieldData {
  name: string;
  values: string[];
}

interface MetaLeadResponse {
  field_data: MetaLeadFieldData[];
  id: string;
  created_time: number;
}

async function fetchMetaLead(leadgenId: string): Promise<MetaLeadResponse | null> {
  const token = process.env.META_PAGE_ACCESS_TOKEN;
  if (!token) {
    console.error("[meta-leads] META_PAGE_ACCESS_TOKEN not set");
    return null;
  }

  const url = `https://graph.facebook.com/v21.0/${leadgenId}?fields=field_data,created_time&access_token=${token}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      console.error("[meta-leads] Graph API error:", res.status, text.slice(0, 300));
      return null;
    }
    return res.json() as Promise<MetaLeadResponse>;
  } catch (err) {
    console.error("[meta-leads] fetch error:", err);
    return null;
  }
}

/* ─── Parse Meta field_data into flat object ─────────────────────── */

function parseFields(fieldData: MetaLeadFieldData[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const f of fieldData) {
    out[f.name.toLowerCase()] = f.values[0] ?? "";
  }
  return out;
}

/* ─── Verify Meta webhook signature (HMAC-SHA256) ────────────────── */

async function verifySignature(req: NextRequest, rawBody: string): Promise<boolean> {
  const appSecret = process.env.META_APP_SECRET;
  if (!appSecret) return true; // skip if not configured (dev mode)

  const signature = req.headers.get("x-hub-signature-256");
  if (!signature) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(appSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody));
  const hex = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const expected = `sha256=${hex}`;

  return signature === expected;
}

/* ─── GET — webhook verification (one-time setup in Meta dashboard) ─ */

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.META_VERIFY_TOKEN;
  if (!verifyToken) {
    console.error("[meta-leads] META_VERIFY_TOKEN not set");
    return new NextResponse("Server misconfigured", { status: 500 });
  }

  if (mode === "subscribe" && token === verifyToken) {
    console.log("[meta-leads] Webhook verified ✓");
    return new NextResponse(challenge, { status: 200 });
  }

  console.error("[meta-leads] Verification failed — token mismatch");
  return new NextResponse("Forbidden", { status: 403 });
}

/* ─── POST — receive lead notification from Meta ─────────────────── */

export async function POST(req: NextRequest) {
  // Read raw body for signature check
  const rawBody = await req.text();

  // Verify the request is genuinely from Meta
  const valid = await verifySignature(req, rawBody);
  if (!valid) {
    console.error("[meta-leads] Invalid signature — rejected");
    return new NextResponse("Forbidden", { status: 403 });
  }

  let body: {
    object?: string;
    entry?: Array<{
      changes?: Array<{
        value?: {
          leadgen_id?: string;
          page_id?: string;
          form_id?: string;
          ad_id?: string;
          ad_name?: string;
          adset_id?: string;
          adset_name?: string;
          campaign_id?: string;
          campaign_name?: string;
        };
        field?: string;
      }>;
    }>;
  };

  try {
    body = JSON.parse(rawBody);
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  // Meta always sends object: "page" for lead ads
  if (body.object !== "page") {
    return NextResponse.json({ status: "ignored" });
  }

  // Process each entry (Meta may batch multiple)
  const entries = body.entry ?? [];
  for (const entry of entries) {
    const changes = entry.changes ?? [];
    for (const change of changes) {
      if (change.field !== "leadgen") continue;

      const val = change.value;
      const leadgenId = val?.leadgen_id;
      if (!leadgenId) continue;

      // Fetch full lead data from Graph API
      const metaLead = await fetchMetaLead(leadgenId);
      if (!metaLead) continue;

      const fields = parseFields(metaLead.field_data);

      // Map Meta field names → our DB schema
      // Meta standard field names: full_name, first_name, last_name, email, phone_number,
      // city, zip_code, state, country, street_address, date_of_birth
      // Custom fields use whatever label you set in the form builder
      const fullName =
        fields["full_name"] ||
        `${fields["first_name"] ?? ""} ${fields["last_name"] ?? ""}`.trim() ||
        "Meta Lead";

      const phone = (fields["phone_number"] ?? fields["phone"] ?? "").replace(/\D/g, "");
      const email = fields["email"] ?? undefined;
      const city = fields["city"] ?? undefined;
      const area = fields["zip_code"] ?? fields["state"] ?? undefined;

      // Custom fields your Meta form may have
      const goldType = fields["gold_type"] ?? fields["what_type_of_gold"] ?? undefined;
      const notes =
        [
          val?.ad_name ? `Ad: ${val.ad_name}` : null,
          val?.adset_name ? `Adset: ${val.adset_name}` : null,
          val?.campaign_name ? `Campaign: ${val.campaign_name}` : null,
          fields["message"] ?? fields["notes"] ?? null,
        ]
          .filter(Boolean)
          .join(" | ") || undefined;

      // Skip if no usable phone
      if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
        console.warn(`[meta-leads] Lead ${leadgenId} — missing/invalid Indian phone: "${phone}"`);
        // Still save but with placeholder so we don't lose the lead
        try {
          await createLead({
            name: fullName,
            phone: phone || "0000000000",
            email: email || undefined,
            city,
            area,
            gold_type: goldType,
            notes: `[INVALID PHONE: ${fields["phone_number"] ?? "none"}] ${notes ?? ""}`.trim(),
            source: "meta-lead-ad",
            utm_source: "facebook",
            utm_medium: "paid-social",
            utm_campaign: val?.campaign_name ?? undefined,
            utm_content: val?.ad_name ?? undefined,
            status: "new",
          });
        } catch (err) {
          console.error("[meta-leads] DB insert error:", err);
        }
        continue;
      }

      try {
        const lead = await createLead({
          name: fullName,
          phone,
          email: email || undefined,
          city,
          area,
          gold_type: goldType,
          notes,
          source: "meta-lead-ad",
          utm_source: "facebook",
          utm_medium: "paid-social",
          utm_campaign: val?.campaign_name ?? undefined,
          utm_content: val?.ad_name ?? undefined,
          status: "new",
        });

        console.log(`[meta-leads] Saved lead ${lead.id} from Meta leadgen ${leadgenId}`);
        syncLeadToSheets(lead).catch(() => {});
      } catch (err) {
        console.error("[meta-leads] DB insert error for", leadgenId, err);
      }
    }
  }

  // Always return 200 immediately — Meta retries if it gets anything else
  return NextResponse.json({ status: "ok" });
}
