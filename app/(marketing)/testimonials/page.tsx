import type { Metadata } from "next";

export const revalidate = 3600; // ISR: testimonials change infrequently

export const metadata: Metadata = {
  title: "Customer Reviews | MK Gold | 4.9 Star Rated",
  description:
    "Read what 10,000+ customers say about MK Gold. 4.9 star Google rating across Karnataka.", // was: 16 branches
  alternates: { canonical: "https://mkgold.in/testimonials" },
};

export default function TestimonialsPage() {
  return (
    <main>
      <p style={{ fontFamily: "Poppins, sans-serif", padding: "2rem" }}>
        MK Gold — Testimonials page (scaffold)
      </p>
    </main>
  );
}
