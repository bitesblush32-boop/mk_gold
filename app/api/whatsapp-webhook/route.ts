import { NextRequest, NextResponse } from "next/server";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN ?? "mkgold_webhook_token";

// GET — webhook verification (Meta/360dialog challenge)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode      = searchParams.get("hub.mode");
  const token     = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// POST — incoming messages
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (!message) {
      return NextResponse.json({ status: "no_message" });
    }

    const from = message.from as string;
    const text = (message.text?.body as string) ?? "";

    console.log(`[whatsapp-webhook] from=${from} text=${text}`);

    // TODO: implement bot decision tree (C5 in CLAUDE.md)
    // Route to branch based on wa_id → branch WhatsApp number mapping

    return NextResponse.json({ status: "received" });
  } catch (err) {
    console.error("[whatsapp-webhook] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
