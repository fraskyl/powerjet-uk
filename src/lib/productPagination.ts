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

export async function getCategoryData(pageType: "rental" | "sale") {
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

  // Drop empty categories so we never link to a dead /rentals/foo/1
  const prune = (nodes: CategoryNode[]): CategoryNode[] =>
    nodes
      .map((n) => ({ ...n, children: prune(n.children) }))
      .filter((n) => n.count > 0);
  const categoryTree = prune(roots);

  return { products, categoryTree, itemsFor, parentOf };
}

function buildTrail(categorySlug: string, parentOf: Map<string, string | undefined>) {
  const trail: string[] = [];
  let cur: string | undefined = categorySlug === "all" ? undefined : categorySlug;
  while (cur) {
    trail.push(cur);
    cur = parentOf.get(cur);
  }
  return trail;
}

export async function getProductPage(
  pageType: "rental" | "sale",
  categorySlug: string,
  pageNumber: number
) {
  if (!Number.isInteger(pageNumber) || pageNumber < 1) return null;

  const { products, categoryTree, itemsFor, parentOf } = await getCategoryData(pageType);

  const items = categorySlug === "all" ? products : itemsFor(categorySlug);
  if (categorySlug !== "all" && items.length === 0) return null;

  const total = items.length;
  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (pageNumber > lastPage) return null;

  const start = (pageNumber - 1) * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, total) - 1;
  const data = items.slice(start, end + 1);

  const base = pageType === "rental" ? "/rentals" : "/sales";
  const page = {
    data,
    start,
    end,
    total,
    currentPage: pageNumber,
    size: PAGE_SIZE,
    lastPage,
    url: {
      current: `${base}/${categorySlug}/${pageNumber}`,
      prev: pageNumber > 1 ? `${base}/${categorySlug}/${pageNumber - 1}` : undefined,
      next: pageNumber < lastPage ? `${base}/${categorySlug}/${pageNumber + 1}` : undefined,
      first: pageNumber > 1 ? `${base}/${categorySlug}/1` : undefined,
      last: pageNumber < lastPage ? `${base}/${categorySlug}/${lastPage}` : undefined,
    },
  };

  return {
    page,
    categoryTree,
    totalCount: products.length,
    activeCategory: categorySlug,
    activeTrail: buildTrail(categorySlug, parentOf),
  };
}
