import type { APIRoute } from "astro";
import { sanityClient } from "../lib/sanity";
import {
  productSlugsQuery,
  applicationSlugsQuery,
  allProductsWithCategoriesQuery,
  allProductCategoriesWithParentsQuery,
} from "../lib/queries";

const STATIC_ROUTES = [
  "/",
  "/contact",
  "/services",
  "/wja-training",
  "/applications",
  "/sales",
  "/rentals",
];

function categoryPathOf(product: any): string[] {
  const path: string[] = [];
  const c = product.productCategory;
  if (c?.slug) {
    path.push(c.slug);
    if (c.parent?.slug) {
      path.push(c.parent.slug);
      if (c.parent.parent?.slug) path.push(c.parent.parent.slug);
    }
  }
  return path;
}

// Mirrors the pruning in productPagination.ts: only link to categories that
// actually have a prerendered page (i.e. at least one product, ancestry included).
function nonEmptyCategorySlugs(products: any[], categories: any[]): string[] {
  const productPaths = products.map(categoryPathOf);
  return categories
    .map((c: any) => c.slug)
    .filter((slug: string) => productPaths.some((path) => path.includes(slug)));
}

export const GET: APIRoute = async () => {
  const siteUrl = (
    import.meta.env.PUBLIC_SITE_URL || "https://powerjet-uk.com"
  ).replace(/\/$/, "");

  const [
    productSlugs,
    applicationSlugs,
    saleProducts,
    saleCategories,
    rentalProducts,
    rentalCategories,
  ] = await Promise.all([
    sanityClient.fetch(productSlugsQuery),
    sanityClient.fetch(applicationSlugsQuery),
    sanityClient.fetch(allProductsWithCategoriesQuery, { availability: "sale" }),
    sanityClient.fetch(allProductCategoriesWithParentsQuery, { availability: "sale" }),
    sanityClient.fetch(allProductsWithCategoriesQuery, { availability: "rental" }),
    sanityClient.fetch(allProductCategoriesWithParentsQuery, { availability: "rental" }),
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
    ...nonEmptyCategorySlugs(saleProducts, saleCategories).map(
      (slug) => `/sales/${slug}/1`
    ),
    "/rentals/all/1",
    ...nonEmptyCategorySlugs(rentalProducts, rentalCategories).map(
      (slug) => `/rentals/${slug}/1`
    ),
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
