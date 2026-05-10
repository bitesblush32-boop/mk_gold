import type { Metadata } from "next";
import { fetchGoldRate } from "@/lib/gold-rate";

// Revalidate every 5 minutes
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Gold Rate Today in Karnataka | Live MCX Price | MK Gold",
  description:
    "Live gold rate today in Bangalore, Mysore, Mangalore and Davangere. 22K, 24K, 18K gold price per gram updated every 5 minutes from MCX.",
  alternates: { canonical: "https://mkgold.in/gold-rate-today" },
};

export default async function GoldRateTodayPage() {
  const rate = await fetchGoldRate();

  return (
    <main>
      <p style={{ fontFamily: "Poppins, sans-serif", padding: "2rem" }}>
        MK Gold — Gold Rate Today page (scaffold) | 24K: ₹{rate.rate24k}/g
      </p>
    </main>
  );
}
