import type { APIRoute } from "astro";
import { getCategoryData, type CategoryNode } from "../lib/productPagination";
import { sanityClient } from "../lib/sanity";
import { productSlugsQuery, applicationSlugsQuery } from "../lib/queries";

const STATIC_ROUTES = [
  "/",
  "/contact",
  "/services",
  "/wja-training",
  "/applications",
  "/sales",
  "/rentals",
];

// categoryTree from getCategoryData is already pruned to non-empty categories
// (i.e. ones that actually resolve to a real listing page) — just flatten it.
function collectSlugs(nodes: CategoryNode[]): string[] {
  return nodes.flatMap((n) => [n.slug, ...collectSlugs(n.children)]);
}

export const GET: APIRoute = async () => {
  const siteUrl = (
    import.meta.env.PUBLIC_SITE_URL || "https://powerjet-uk.com"
  ).replace(/\/$/, "");

  const [productSlugs, applicationSlugs, saleData, rentalData] = await Promise.all([
    sanityClient.fetch(productSlugsQuery),
    sanityClient.fetch(applicationSlugsQuery),
    getCategoryData("sale"),
    getCategoryData("rental"),
  ]);

  const paths = [
    ...STATIC_ROUTES,
    // Slugs containing "/" can't match the single-segment [slug] route and 404 —
    // exclude them here rather than list a dead page (fix the slug in Sanity).
    ...productSlugs
      .filter((p: any) => !p.slug.includes("/"))
      .map((p: any) => `/products/${p.slug}`),
    ...applicationSlugs.map((a: any) => `/applications/${a.slug}`),
    "/sales/all/1",
    ...collectSlugs(saleData.categoryTree).map((slug) => `/sales/${slug}/1`),
    "/rentals/all/1",
    ...collectSlugs(rentalData.categoryTree).map((slug) => `/rentals/${slug}/1`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`).join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml" },
  });
};
