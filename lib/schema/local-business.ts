import type { Branch } from "@/lib/branch-router";
import { MK_SOCIAL_PROFILES } from "@/lib/schema/organization";

export function localBusinessSchema(branch?: Branch) {
  if (branch) {
    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: branch.name,
      url: `https://mkgold.in/${branch.slug}`,
      telephone: branch.phone,
      image: "https://mkgold.in/mkgoldlogo.png",
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
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "10:00",
        closes: "20:00",
      },
      priceRange: "₹₹",
      currenciesAccepted: "INR",
      paymentAccepted: "Cash, Bank Transfer, NEFT, RTGS, UPI",
      sameAs: [...MK_SOCIAL_PROFILES],
    };
  }

  // Organisation-level LocalBusiness (homepage)
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "MKGOLD",
    image: "https://mkgold.in/mkgoldlogo.png",
    url: "https://www.mkgold.in/",
    telephone: "+91-7019500600",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Your Street Address",
      addressLocality: "Bangalore",
      addressRegion: "Karnataka",
      postalCode: "560079",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "12.9716",
      longitude: "77.5946",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "10:00",
      closes: "20:00",
    },
    priceRange: "₹₹",
    sameAs: [...MK_SOCIAL_PROFILES],
  };
}
