// Shared "coming soon" shell for city hubs not yet active (N14 follow-up)
// Used by: sell-gold-mysore · sell-gold-mangalore · sell-gold-davangere

import { MkNavbar } from "@/components/layout/MkNavbar";
import { MkFooter } from "@/components/layout/MkFooter";
import { MkButton } from "@/components/ui/MkButton";

interface CityComingSoonProps {
  city: string;
}

export function CityComingSoon({ city }: CityComingSoonProps) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://mkgold.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `Sell Gold in ${city}`,
        item: `https://mkgold.in/sell-gold-${city.toLowerCase()}`,
      },
    ],
  };

  return (
    <main>
      <MkNavbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section
        className="mk-bg-dark section"
        style={{
          paddingTop: "calc(var(--chrome-h) + var(--s-10))",
          paddingBottom: "var(--s-12)",
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
        }}
        aria-labelledby="city-coming-soon-h1"
      >
        <div className="mk-container">
          <div className="reveal" style={{ maxWidth: "640px" }}>
            <p className="mk-section-overline">Coming Soon · {city}</p>

            <h1
              id="city-coming-soon-h1"
              style={{
                fontFamily: "Tanker, serif",
                fontSize: "var(--t-h1)",
                color: "var(--white)",
                margin: "0.5rem 0 1rem",
                lineHeight: 1.1,
              }}
            >
              MK Gold is coming soon to
              <span style={{ color: "rgba(255,255,255,0.30)" }}> </span>
              <span style={{ color: "var(--gold)" }}>{city}</span>
            </h1>

            <p
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "var(--t-lg)",
                color: "rgba(255,255,255,0.72)",
                margin: "0 0 2rem",
                lineHeight: 1.65,
              }}
            >
              We&apos;re currently active in Bangalore, with {city} opening
              soon. Same live MCX rates, same XRF purity testing, same 30-minute
              payment — as soon as we open here. In the meantime, you&apos;re
              welcome to visit our Bangalore branches or call us for details.
            </p>

            <div className="mk-hub-hero-ctas">
              <MkButton variant="gold" href="/sell-gold-bangalore">
                See Bangalore Branches
              </MkButton>
              <MkButton variant="outline-light" href="tel:+917019500600">
                Call Us
              </MkButton>
            </div>
          </div>
        </div>
      </section>

      <MkFooter />
    </main>
  );
}
