import type { Metadata } from "next";

export const revalidate = 3600; // ISR: city hub content changes infrequently

import { CityComingSoon } from "@/components/sections/CityComingSoon";

export const metadata: Metadata = {
  title: "Sell Gold in Davangere | Coming Soon | MK Gold",
  description:
    "MK Gold is coming soon to Davangere. Currently active in Bangalore with live MCX rates, XRF purity test, and payment in 30 minutes.",
  alternates: { canonical: "https://mkgold.in/sell-gold-davangere" },
  openGraph: {
    title: "Sell Gold in Davangere | Coming Soon | MK Gold",
    description:
      "MK Gold is coming soon to Davangere. Currently active in Bangalore.",
    url: "https://mkgold.in/sell-gold-davangere",
    siteName: "MK Gold",
    locale: "en_IN",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function SellGoldDavangerePage() {
  return <CityComingSoon city="Davangere" />;
}
