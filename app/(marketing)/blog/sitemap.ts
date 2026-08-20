import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/db/blog";

// Regenerate every hour so new/updated posts appear in the sitemap promptly
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const posts = await getPublishedPosts();
    return posts.map((post) => ({
      url: `https://mkgold.in/blog/${post.slug}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // DB unavailable at build time — return empty; Google will re-crawl
    return [];
  }
}
