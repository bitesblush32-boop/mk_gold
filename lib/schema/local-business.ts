import type { Branch } from "@/lib/branch-router";

export function localBusinessSchema(branch?: Branch) {
  if (branch) {
    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: branch.name,
      url: `https://mkgold.in/${branch.slug}`,
      telephone: branch.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: branch.address,
        addressLocality: branch.city,
        addressRegion: "Karnataka",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: branch.coordinates.lat,
        longitude: branch.coordinates.lng,
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:30",
        closes: "19:00",
      },
      priceRange: "Fair market MCX rate",
      currenciesAccepted: "INR",
      paymentAccepted: "Cash, Bank Transfer, NEFT, RTGS",
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MK Gold",
    url: "https://mkgold.in",
    logo: "https://mkgold.in/brand/logo-primary-light.svg",
    description:
      "Karnataka's trusted gold buyer since 2014. 16 branches across Bangalore, Mysore, Mangalore and Davangere.",
    foundingDate: "2014",
    areaServed: "Karnataka",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English", "Kannada", "Hindi"],
    },
  };
}
