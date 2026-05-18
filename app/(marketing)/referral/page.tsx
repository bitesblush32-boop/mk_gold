import type { Metadata } from "next";

export const revalidate = false; // Static at build — content never changes without redeploy

export const metadata: Metadata = {
  title: "Refer & Earn | MK Gold Referral Programme",
  description:
    "Refer a friend to MK Gold and earn a reward when they sell gold. Simple, transparent referral programme.",
  alternates: { canonical: "https://mkgold.in/referral" },
};

export default function ReferralPage() {
  return (
    <main>
      <p style={{ fontFamily: "Poppins, sans-serif", padding: "2rem" }}>
        MK Gold — Referral page (scaffold)
      </p>
    </main>
  );
}
