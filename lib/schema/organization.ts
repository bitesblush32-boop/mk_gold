export const MK_SOCIAL_PROFILES = [
  "https://www.facebook.com/profile.php?id=61572106750563",
  "https://www.instagram.com/mkgold_official/",
  "https://www.linkedin.com/company/mk-gold/",
  "https://www.youtube.com/@MkGold_official",
  "https://x.com/mkgold_official",
  "https://www.threads.com/@mkgold_official",
  "https://in.pinterest.com/mkgolddigitalmarketing/mk-gold/",
] as const;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MK Gold",
    url: "https://mkgold.in",
    logo: "https://mkgold.in/mkgoldlogo.png",
    description:
      "Karnataka's trusted gold buyer since 2014. 16 branches across Bangalore, Mysore, Mangalore and Davangere.",
    foundingDate: "2014",
    telephone: "+91-7019500600",
    areaServed: {
      "@type": "State",
      name: "Karnataka",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-7019500600",
      contactType: "customer service",
      availableLanguage: ["English", "Kannada", "Hindi"],
    },
    sameAs: [...MK_SOCIAL_PROFILES],
  };
}
