import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gold Buying Guide | Blog | MK Gold",
  description:
    "Tips on selling gold, understanding gold rates, pledged gold release and more. Expert insights from MK Gold.",
  alternates: { canonical: "https://mkgold.in/blog" },
};

export default function BlogPage() {
  return (
    <main>
      <p style={{ fontFamily: "Poppins, sans-serif", padding: "2rem" }}>
        MK Gold — Blog index (scaffold)
      </p>
    </main>
  );
}
