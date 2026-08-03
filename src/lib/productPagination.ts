import type { PaginateFunction } from "astro";
import { sanityClient } from "./sanity";
import {
  allProductsWithCategoriesQuery,
  allProductCategoriesWithParentsQuery,
} from "./queries";

const PAGE_SIZE = 12;

export interface CategoryNode {
  slug: string;
  title: string;
  order: number;
  count: number; // products in this category, descendants included
  children: CategoryNode[];
}

function normaliseProduct(product: any) {
  let imageUrl = product.imageUrl;
  let imageAlt = product.imageAlt;
  if (product.images?.length > 0) {
    imageUrl = product.images[0].url;
    imageAlt = product.images[0].alt;
  }
  // Full ancestry: [leaf, parent, grandparent]
  const categoryPath: string[] = [];
  const c = product.productCategory;
  if (c?.slug) {
    categoryPath.push(c.slug);
    if (c.parent?.slug) {
      categoryPath.push(c.parent.slug);
      if (c.parent.parent?.slug) categoryPath.push(c.parent.parent.slug);
    }
  }
  return { ...product, imageUrl, imageAlt, categoryPath };
}

export async function buildProductPaths(
  paginate: PaginateFunction,
  pageType: "rental" | "sale"
) {
  const [rawProducts, flatCategories] = await Promise.all([
    sanityClient.fetch(allProductsWithCategoriesQuery, { availability: pageType }),
    sanityClient.fetch(allProductCategoriesWithParentsQuery, { availability: pageType }),
  ]);

  const products = rawProducts.map(normaliseProduct);

  // A product counts for a category if that slug is anywhere in its ancestry.
  // ← This one line is the grouping decision. For "direct children only",
  //   change it to: p.productCategory?.slug === slug
  const itemsFor = (slug: string) =>
    products.filter((p: any) => (p.categoryPath || []).includes(slug));

  // parentSlug lookup, used to build each active category's ancestor trail
  const parentOf = new Map<string, string | undefined>();
  flatCategories.forEach((c: any) => parentOf.set(c.slug, c.parentSlug || undefined));

  // Build the nested tree from the flat, parentSlug-tagged list
  const bySlug = new Map<string, CategoryNode>();
  flatCategories.forEach((c: any) =>
    bySlug.set(c.slug, {
      slug: c.slug,
      title: c.title,
      order: c.order ?? 0,
      count: itemsFor(c.slug).length,
      children: [],
    })
  );
  const roots: CategoryNode[] = [];
  flatCategories.forEach((c: any) => {
    const node = bySlug.get(c.slug)!;
    const parent = c.parentSlug ? bySlug.get(c.parentSlug) : undefined;
    if (parent) parent.children.push(node);
    else roots.push(node);
  });
  const sortTree = (nodes: CategoryNode[]) => {
    nodes.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
    nodes.forEach((n) => sortTree(n.children));
  };
  sortTree(roots);

  // Drop empty categories so we never generate a dead /rentals/foo/1
  const prune = (nodes: CategoryNode[]): CategoryNode[] =>
    nodes
      .map((n) => ({ ...n, children: prune(n.children) }))
      .filter((n) => n.count > 0);
  const categoryTree = prune(roots);

  // "all" plus every non-empty category gets its own paginated route set
  const groups = [
    { slug: "all", items: products },
    ...flatCategories
      .map((c: any) => ({ slug: c.slug, items: itemsFor(c.slug) }))
      .filter((g: any) => g.items.length > 0),
  ];

  return groups.flatMap((group) => {
    const trail: string[] = [];
    let cur: string | undefined = group.slug === "all" ? undefined : group.slug;
    while (cur) {
      trail.push(cur);
      cur = parentOf.get(cur);
    }

    return paginate(group.items, {
      params: { category: group.slug },
      pageSize: PAGE_SIZE,
      props: {
        categoryTree,
        totalCount: products.length,
        activeCategory: group.slug,
        activeTrail: trail,
      },
    });
  });
}