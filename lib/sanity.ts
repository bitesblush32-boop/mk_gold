import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any;

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// ─── Sanity Types ──────────────────────────────────────────────

export interface SanityBranch {
  _id: string;
  name: string;
  slug: { current: string };
  city: string;
  address: string;
  phone: string;
  whatsapp: string;
  coordinates: { lat: number; lng: number };
  openHours: string;
  mapEmbed?: string;
}

export interface SanityTestimonial {
  _id: string;
  name: string;
  area: string;
  rating: number;
  text: string;
  date: string;
  googleReviewId?: string;
}

export interface SanityBlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  body: unknown[];
  publishedAt: string;
  author: string;
  coverImage?: SanityImageSource;
  tags: string[];
}

export interface SanityFaqItem {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}
