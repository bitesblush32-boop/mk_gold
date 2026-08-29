import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "maps.googleapis.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
    // Allow quality values used in the app (default only allows 75)
    qualities: [75, 85],
    // Serve WebP/AVIF on Vercel production
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    root: __dirname,
  },
  experimental: {
    optimizeCss: true,
  },
  async headers() {
    return [
      // sw.js — no service worker in this project; fast 404, no browser retry
      {
        source: "/sw.js",
        headers: [{ key: "Cache-Control", value: "no-store, no-cache" }],
      },
      // Public external API (v1) — CORS open to all origins
      {
        source: "/api/v1/(.*)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
      // Admin pages — never cache in browser or CDN
      {
        source: "/admin(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate",
          },
          { key: "Pragma", value: "no-cache" },
        ],
      },
      // Admin API — never cache
      {
        source: "/api/admin(.*)",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
