import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const siteUrl = (
    import.meta.env.PUBLIC_SITE_URL || "https://powerjet-uk.com"
  ).replace(/\/$/, "");
  const isProduction = import.meta.env.PUBLIC_SANITY_DATASET === "production";

  // Non-production builds (staging, previews) must never be indexed.
  const body = isProduction
    ? `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
    : `User-agent: *\nDisallow: /\n`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
};
