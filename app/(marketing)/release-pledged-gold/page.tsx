import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Release Pledged Gold | Confidential Help | MK Gold",
  description:
    "We help you release gold pledged at banks and NBFCs. We pay the lender directly in front of you. Confidential, dignified service across Karnataka.",
  alternates: { canonical: "https://mkgold.in/release-pledged-gold" },
};

export default function PledgedGoldPage() {
  return (
    <main>
      <p style={{ fontFamily: "Poppins, sans-serif", padding: "2rem" }}>
        MK Gold — Release Pledged Gold page (scaffold)
      </p>
    </main>
  );
}
