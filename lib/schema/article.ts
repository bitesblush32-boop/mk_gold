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
    headline: props.title,
    description: props.description,
    url: props.url,
    datePublished: props.datePublished,
    dateModified: props.dateModified,
    author: {
      "@type": "Organization",
      name: props.author ?? "MK Gold",
    },
    publisher: {
      "@type": "Organization",
      name: "MK Gold",
      logo: {
        "@type": "ImageObject",
        url: "https://mkgold.in/brand/logo-primary-light.svg",
      },
    },
    ...(props.imageUrl && {
      image: { "@type": "ImageObject", url: props.imageUrl },
    }),
  };
}
