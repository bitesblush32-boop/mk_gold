import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Poppins, Anek_Kannada } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { MkRevealObserver } from "@/components/ui/MkRevealObserver";
import { MkSocialProof } from "@/components/features/MkSocialProof";
import { GoldRateProvider } from "@/context/GoldRateContext";
import { localBusinessSchema } from "@/lib/schema/local-business";
import { organizationSchema } from "@/lib/schema/organization";
import "./globals.css";

const GTM_ID      = process.env.NEXT_PUBLIC_GTM_ID      ?? '';
const GA_ID       = process.env.NEXT_PUBLIC_GA_ID       ?? '';
const ADS_ID      = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? '';
const ADS_CALL    = process.env.NEXT_PUBLIC_GOOGLE_ADS_CALL_LABEL ?? '';
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID ?? '';

const poppins = Poppins({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const anekKannada = Anek_Kannada({
  variable: "--font-kannada",
  subsets: ["kannada"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3B1848",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://mkgold.in"),
  title: {
    default: "MK Gold — Sell Gold in Karnataka | Instant Cash | 15 Years Trusted",
    template: "%s | MK Gold",
  },
  description:
    "Karnataka's most trusted gold buyer since 2014. Live MCX rates, XRF purity test, payment in 30 minutes. 16 branches in Bangalore, Mysore, Mangalore & Davangere.",
  keywords: [
    "sell gold Karnataka",
    "gold buyer Bangalore",
    "sell gold jewellery",
    "gold rate today",
    "pledged gold release",
    "MK Gold",
  ],
  authors: [{ name: "MK Gold", url: "https://mkgold.in" }],
  creator: "MK Gold",
  verification: {
    google: "kngp9_6DxVztBM7nc2H8GtkFv6G2lvZEZc2EGZVW4xg",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://mkgold.in",
    siteName: "MK Gold",
    title: "MK Gold — Sell Gold in Karnataka | Instant Cash | 15 Years Trusted",
    description:
      "Karnataka's trusted gold buyer since 2014. Live MCX rates, XRF purity test, payment in 30 minutes. 16 branches.",
    images: [{ url: "https://mkgold.in/mkgoldlogo.png", width: 400, height: 400, alt: "MK Gold" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@mkgold_official",
    title: "MK Gold — Sell Gold in Karnataka",
    description: "Instant cash for gold. Live MCX rates. 16 branches. Trusted since 2014.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://mkgold.in" },
};

/* ─── Site-wide JSON-LD (rendered once, in layout) ─────────────── */

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Gold Buying Service",
  provider: { "@type": "LocalBusiness", name: "MKGOLD" },
  areaServed: { "@type": "City", name: "Bangalore" },
  description:
    "Sell your old gold for instant cash at the best price in Bangalore with transparent gold testing and zero hidden charges.",
};

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "MKGOLD",
  url: "https://mkgold.in/",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://mkgold.in/?s={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How can I sell gold in Bangalore?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Visit any MK Gold branch in Bangalore to get instant cash for your gold with transparent XRF testing and the best MCX-linked market price. No appointment needed.",
      },
    },
    {
      "@type": "Question",
      name: "Do you provide instant payment for gold?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, MK Gold provides payment within 30 minutes after gold evaluation — by cash, UPI, NEFT or RTGS. No hidden charges.",
      },
    },
    {
      "@type": "Question",
      name: "Is gold testing free at MK Gold?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, gold purity testing using our German XRF spectrometer is 100% free and transparent. The result is shown on the machine screen before any price is quoted.",
      },
    },
    {
      "@type": "Question",
      name: "What gold can I sell at MK Gold?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We buy all gold jewellery (18K, 20K, 22K, 24K), gold coins, gold bars, and broken or damaged gold pieces. No original receipts or hallmark certificates required.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable} ${anekKannada.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* ── Google Tag Manager ── */}
        {GTM_ID && (
          <Script id="gtm-head" strategy="afterInteractive">{`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}</Script>
        )}

        {/* ── Google Analytics 4 ── */}
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}</Script>
          </>
        )}

        {/* ── Google Ads + call conversion ── */}
        {ADS_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`} strategy="afterInteractive" />
            <Script id="google-ads-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ADS_ID}');
              ${ADS_CALL ? `gtag('config', '${ADS_ID}', { phone_conversion_number: '07019500600' });` : ''}
            `}</Script>
          </>
        )}

        {/* ── Facebook Pixel ── */}
        {FB_PIXEL_ID && (
          <Script id="fb-pixel" strategy="afterInteractive">{`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `}</Script>
        )}

        {/* ── Site-wide JSON-LD ── */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_SCHEMA) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        {/* Google Tag Manager (noscript) */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        {/* Facebook Pixel (noscript) */}
        {FB_PIXEL_ID && (
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        )}

        <MkRevealObserver />
        <GoldRateProvider>
          {children}
        </GoldRateProvider>
        <MkSocialProof />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
