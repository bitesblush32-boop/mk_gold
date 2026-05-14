/**
 * Send a text message via 360dialog WhatsApp Business API.
 * Silently swallows errors — WhatsApp is a notification, not a blocker.
 */
export async function sendWhatsApp(to: string, body: string): Promise<void> {
  const token = process.env.WHATSAPP_API_TOKEN;
  if (!token) return; // not configured

  // Normalise number — strip leading + and spaces
  const normalised = to.replace(/^\+/, '').replace(/\s/g, '');

  try {
    await fetch('https://waba.360dialog.io/v1/messages', {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        'D360-API-KEY': token,
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to:   normalised,
        type: 'text',
        text: { body },
      }),
    });
  } catch {
    // Non-critical — log only in dev
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[whatsapp] failed to send to ${to}`);
    }
  }
}
