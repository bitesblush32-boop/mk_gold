export interface BreadcrumbSegment {
  name: string;
  url: string;
}

export function breadcrumbSchema(segments: BreadcrumbSegment[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: segments.map((seg, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: seg.name,
      item: seg.url,
    })),
  };
}
