import Link from "next/link";
import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { toCard } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 8;

const SORTS = {
  newest: { label: "Newest", orderBy: { createdAt: "desc" } },
  "price-asc": { label: "Price: low to high", orderBy: { price: "asc" } },
  "price-desc": { label: "Price: high to low", orderBy: { price: "desc" } },
} as const;

type SortKey = keyof typeof SORTS;

type Params = {
  q?: string;
  category?: string;
  sort?: string;
  page?: string;
};

function makeHref(params: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) sp.set(key, value);
  }
  const text = sp.toString();
  return text ? `/products?${text}` : "/products";
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const category = sp.category ?? "";
  const sort: SortKey = sp.sort && sp.sort in SORTS ? (sp.sort as SortKey) : "newest";
  const page = Math.max(1, Number(sp.page) || 1);

  const where = {
    ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {}),
    ...(category ? { category: { slug: category } } : {}),
  };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: SORTS[sort].orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const chip = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-bold shadow transition hover:scale-105 ${
      active
        ? "bg-gradient-to-r from-grape to-coral text-white"
        : "bg-white hover:bg-lilac/40"
    }`;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#ede9fe] via-[#fce7f3] to-[#fef3c7] px-6 py-8">
        <div className="float-slow absolute -right-6 -top-6 h-28 w-28 rounded-full bg-sun/60" />
        <div className="float-slower absolute bottom-0 right-24 h-16 w-16 rounded-full bg-mint/70" />
        <div className="relative flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">
            All{" "}
            <span className="bg-gradient-to-r from-grape via-coral to-sun bg-clip-text text-transparent">
              products
            </span>
          </h1>
          <span className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-grape shadow">
            {total} {total === 1 ? "item" : "items"}
          </span>
        </div>
      </div>

      <form action="/products" className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-grape"
        />
        <input
          name="q"
          defaultValue={q}
          placeholder="Search products"
          className="input rounded-full pl-11 shadow"
        />
        {category && <input type="hidden" name="category" value={category} />}
        {sort !== "newest" && <input type="hidden" name="sort" value={sort} />}
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm font-bold text-grape">Category</span>
        <Link href={makeHref({ q, sort })} className={chip(!category)}>
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={makeHref({ q, sort, category: c.slug })}
            className={chip(category === c.slug)}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm font-bold text-grape">Sort</span>
        {(Object.keys(SORTS) as SortKey[]).map((key) => (
          <Link
            key={key}
            href={makeHref({
              q,
              category,
              sort: key === "newest" ? undefined : key,
            })}
            className={chip(sort === key)}
          >
            {SORTS[key].label}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="card bg-white py-16 text-center text-sm font-bold text-ink/60">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={toCard(p)} />
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4 text-sm">
          {page > 1 && (
            <Link
              href={makeHref({ q, category, sort, page: String(page - 1) })}
              className="btn-light"
            >
              Previous
            </Link>
          )}
          <span className="rounded-full bg-white px-4 py-2 font-bold text-ink/60 shadow">
            Page {page} of {pages}
          </span>
          {page < pages && (
            <Link
              href={makeHref({ q, category, sort, page: String(page + 1) })}
              className="btn-light"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}