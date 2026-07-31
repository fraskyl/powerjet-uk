import type { PaginateFunction } from "astro";
import { sanityClient } from "./sanity";
import { allProductsQuery, productTypesQuery } from "./queries";

export async function buildProductPaths(
  paginate: PaginateFunction,
  pageType: "rental" | "sale"
) {
  const [all, types] = await Promise.all([
    sanityClient.fetch(allProductsQuery),
    sanityClient.fetch(productTypesQuery),
  ]);

  const products = all.filter((p: any) => p.availability?.includes(pageType));

  // Only categories that actually contain products for this pageType
  const nonEmptyTypes = types.filter((t: any) =>
    products.some((p: any) => p.productType?.slug === t.slug)
  );

  // Tabs: "All" first, then the real categories
  const categories = [{ title: "All Products", slug: "all" }, ...nonEmptyTypes];

  // One paginate() grouping per category, plus an "all" grouping
  const groups = [
    { slug: "all", items: products },
    ...nonEmptyTypes.map((t: any) => ({
      slug: t.slug,
      items: products.filter((p: any) => p.productType?.slug === t.slug),
    })),
  ];

  return groups.flatMap((group) =>
    paginate(group.items, {
      params: { category: group.slug },
      pageSize: 12,
      props: { categories, activeCategory: group.slug },
    })
  );
}