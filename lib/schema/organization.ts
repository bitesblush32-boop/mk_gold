export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MK Gold",
    url: "https://mkgold.in",
    logo: "https://mkgold.in/brand/logo-primary-light.svg",
    description:
      "Karnataka's trusted gold buyer since 2014. 16 branches across Bangalore, Mysore, Mangalore and Davangere.",
    foundingDate: "2014",
    areaServed: {
      "@type": "State",
      name: "Karnataka",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English", "Kannada", "Hindi"],
    },
    sameAs: [],
  };
}
