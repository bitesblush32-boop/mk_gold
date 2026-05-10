import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact MK Gold | 16 Branches | Karnataka",
  description:
    "Find your nearest MK Gold branch. 16 locations across Bangalore, Mysore, Mangalore and Davangere. Walk in or book an appointment.",
  alternates: { canonical: "https://mkgold.in/contact" },
};

export default function ContactPage() {
  return (
    <main>
      <p style={{ fontFamily: "Poppins, sans-serif", padding: "2rem" }}>
        MK Gold — Contact page (scaffold)
      </p>
    </main>
  );
}
