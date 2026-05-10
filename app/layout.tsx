import type { Metadata } from "next";
import { Poppins, Anek_Kannada } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { MkRevealObserver } from "@/components/ui/MkRevealObserver";
import { GoldRateProvider } from "@/context/GoldRateContext";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://mkgold.in"),
  title: {
    default: "MK Gold — Sell Gold in Karnataka | Instant Cash | 11 Years Trusted",
    template: "%s | MK Gold",
  },
  description:
    "MK Gold — Karnataka's trusted gold buyer since 2014. Sell gold jewellery, coins & bars at live MCX rates. XRF purity test. Payment in 45 minutes. 16 branches in Bangalore, Mysore, Mangalore & Davangere.",
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
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://mkgold.in",
    siteName: "MK Gold",
    title: "MK Gold — Sell Gold in Karnataka | Instant Cash | 11 Years Trusted",
    description:
      "Karnataka's trusted gold buyer since 2014. Live MCX rates, XRF purity test, payment in 45 minutes. 16 branches.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MK Gold — Sell Gold in Karnataka",
    description: "Instant cash for gold. Live MCX rates. 16 branches. Trusted since 2014.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://mkgold.in" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable} ${anekKannada.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <MkRevealObserver />
        <GoldRateProvider>
          {children}
        </GoldRateProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
