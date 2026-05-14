import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why MK Gold | ISO Certified | XRF Technology | Fair Rates",
  description:
    "Why sell gold to MK Gold? ISO 9001:2015, German XRF spectrometer, live MCX rates shown side by side, payment in 30 minutes. Zero deductions, zero surprises.",
  alternates: { canonical: "https://mkgold.in/why-mk-gold" },
};

export default function WhyMkGoldPage() {
  return (
    <main>
      <p style={{ fontFamily: "Poppins, sans-serif", padding: "2rem" }}>
        MK Gold — Why MK Gold page (scaffold)
      </p>
    </main>
  );
}
