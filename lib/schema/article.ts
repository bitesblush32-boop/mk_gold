export interface ArticleSchemaProps {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  author?: string;
  imageUrl?: string;
}

export function articleSchema(props: ArticleSchemaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": props.url },
    headline: props.title,
    description: props.description,
    url: props.url,
    datePublished: props.datePublished,
    dateModified: props.dateModified,
    author: {
      "@type": "Organization",
      name: props.author ?? "MK Gold",
      url: "https://mkgold.in",
    },
    publisher: {
      "@type": "Organization",
      name: "MK Gold",
      url: "https://mkgold.in",
      logo: {
        "@type": "ImageObject",
        url: "https://mkgold.in/brand/logo-primary-light.svg",
        width: 200,
        height: 60,
      },
    },
    ...(props.imageUrl && {
      image: {
        "@type": "ImageObject",
        url: props.imageUrl,
        width: 1200,
        height: 630,
      },
    }),
  };
}
