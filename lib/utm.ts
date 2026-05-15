/**
 * UTM parameter reader — call from any 'use client' component at form-submit time.
 * Reads directly from window.location.search so it always reflects the current URL,
 * including params set by Google Ads, Meta Ads, or manual campaign links.
 *
 * Integrated ad platforms (from On-Page-Work.txt):
 *  - Google Ads:    AW-18095364567  → utm_source=google&utm_medium=cpc
 *  - GA4:           G-DG8ZRQKLK8   → utm_source=google&utm_medium=organic
 *  - GTM:           GTM-NZ6FHPLR   → enriches all of the above
 *  - Meta Pixel:    807662748814627 → utm_source=facebook&utm_medium=cpc
 *                                  or utm_source=instagram&utm_medium=cpc
 */
export function getUtmParams(): {
  utm_source?:   string;
  utm_medium?:   string;
  utm_campaign?: string;
  utm_content?:  string;
  source_page?:  string;
} {
  if (typeof window === 'undefined') return {};
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source:   p.get('utm_source')   || undefined,
    utm_medium:   p.get('utm_medium')   || undefined,
    utm_campaign: p.get('utm_campaign') || undefined,
    utm_content:  p.get('utm_content')  || undefined,
    source_page:  window.location.pathname,
  };
}

/**
 * Derive a human-readable acquisition channel from stored lead data.
 * Used in the admin leads table to replace the raw `source` string.
 */
export function getChannel(lead: {
  utm_source?:  string | null;
  utm_medium?:  string | null;
  utm_campaign?: string | null;
  source?:      string | null;
}): { label: string; color: string } {
  const src = (lead.utm_source ?? '').toLowerCase();
  const med = (lead.utm_medium ?? '').toLowerCase();
  const raw = (lead.source     ?? '').toLowerCase();

  // Paid channels — identified by utm_medium=cpc/paid/paidsocial
  if (med === 'cpc' || med === 'paid' || med === 'paidsocial' || med === 'paid_social') {
    if (src.includes('google'))                              return { label: 'Google Ads',    color: '#1a73e8' };
    if (src.includes('facebook') || src.includes('fb'))     return { label: 'Meta Ads',      color: '#1877f2' };
    if (src.includes('instagram'))                          return { label: 'Instagram Ads', color: '#c13584' };
    return { label: 'Paid Ad', color: '#7B2C91' };
  }

  // Organic search
  if (med === 'organic' || (src === 'google' && !med))      return { label: 'Google Organic', color: '#188038' };

  // Social (non-paid)
  if (src.includes('facebook') || src.includes('instagram') || med === 'social')
                                                            return { label: 'Social',         color: '#1877f2' };

  // First-party source field
  if (raw === 'whatsapp')                                   return { label: 'WhatsApp',       color: '#1ba448' };
  if (raw === 'call')                                       return { label: 'Phone Call',     color: '#5f6368' };
  if (raw === 'walkin')                                     return { label: 'Walk-in',        color: '#DFC160' };
  if (raw.includes('popup'))                                return { label: 'Popup',          color: '#7B2C91' };
  if (raw.includes('callback'))                             return { label: 'Callback',       color: '#512561' };
  if (raw.includes('calculator'))                           return { label: 'Calculator',     color: '#C9A940' };

  // Has UTM source but unknown medium
  if (src)                                                  return { label: src,              color: '#5f6368' };

  return { label: 'Direct', color: '#8A7898' };
}
