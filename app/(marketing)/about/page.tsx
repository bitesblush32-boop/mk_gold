import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About MK Gold | 11 Years Trusted | Karnataka Since 2014",
  description:
    "MK Gold — established 2014. Karnataka's trusted gold buyer with 16 branches, ISO 9001:2015 certification, German XRF spectrometer and 10,000+ satisfied customers.",
  alternates: { canonical: "https://mkgold.in/about" },
};

export default function AboutPage() {
  return (
    <main>
      <p style={{ fontFamily: "Poppins, sans-serif", padding: "2rem" }}>
        MK Gold — About Us page (scaffold)
      </p>
    </main>
  );
}
