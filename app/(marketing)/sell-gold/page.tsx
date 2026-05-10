import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sell Gold | Best Rate Today | MK Gold Karnataka",
  description:
    "Sell gold jewellery, coins and bars at live MCX rates. XRF purity test, transparent valuation, payment in 45 minutes. 16 branches in Karnataka.",
  alternates: { canonical: "https://mkgold.in/sell-gold" },
};

export default function SellGoldPage() {
  return (
    <main>
      <p style={{ fontFamily: "Poppins, sans-serif", padding: "2rem" }}>
        MK Gold — Sell Gold page (scaffold)
      </p>
    </main>
  );
}
