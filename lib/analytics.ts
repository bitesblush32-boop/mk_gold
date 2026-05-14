/**
 * Analytics helpers — wraps gtag calls so they never crash when
 * the script hasn't loaded yet (SSR, ad-blockers, slow connections).
 *
 * Usage:
 *   import { trackFormSubmit, trackCallConversion } from '@/lib/analytics';
 *   trackFormSubmit({ branch: 'rajajinagar', source: 'popup' });
 *   trackCallConversion();
 */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    fbq: (...args: unknown[]) => void;
  }
}

const ADS_ID     = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID     ?? '';
const CALL_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_CALL_LABEL ?? '';

function gtag(...args: unknown[]) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args);
  }
}

function fbq(...args: unknown[]) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq(...args);
  }
}

/** Fire when a lead form is successfully submitted */
export function trackFormSubmit(params?: { branch?: string; source?: string }) {
  gtag('event', 'form_submit', {
    event_category: 'Lead',
    event_label: params?.source ?? 'website',
    branch: params?.branch ?? '',
  });
  // Google Ads conversion
  if (ADS_ID) {
    gtag('event', 'conversion', { send_to: `${ADS_ID}/form_submit_label` });
  }
  // Facebook lead event
  fbq('track', 'Lead');
}

/** Fire when a phone call link is clicked */
export function trackCallConversion() {
  if (ADS_ID && CALL_LABEL) {
    gtag('config', ADS_ID, {
      phone_conversion_number: '07019500600',
    });
    gtag('event', 'conversion', { send_to: `${ADS_ID}/${CALL_LABEL}` });
  }
  gtag('event', 'click_call', { event_category: 'Contact' });
  fbq('track', 'Contact');
}

/** Fire on WhatsApp button click */
export function trackWhatsAppClick(branch?: string) {
  gtag('event', 'click_whatsapp', {
    event_category: 'Contact',
    event_label: branch ?? 'default',
  });
  fbq('track', 'Contact');
}

/** Fire on appointment booking */
export function trackAppointmentBooked(branch?: string) {
  gtag('event', 'appointment_booked', {
    event_category: 'Lead',
    event_label: branch ?? 'website',
  });
  fbq('track', 'Schedule');
}
