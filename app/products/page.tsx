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
    `rounded-full px-4 py-1.5 text-sm font-medium transition ${
      active
        ? "bg-indigo-500 text-white"
        : "bg-white/5 text-slate-300 hover:bg-white/10"
    }`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          All products
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          {total} {total === 1 ? "product" : "products"} found
        </p>
      </div>

      <form action="/products" className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          name="q"
          defaultValue={q}
          placeholder="Search products"
          className="input pl-9"
        />
        {category && <input type="hidden" name="category" value={category} />}
        {sort !== "newest" && <input type="hidden" name="sort" value={sort} />}
      </form>

      <div className="flex flex-wrap items-center gap-2">
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

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-slate-500">Sort:</span>
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
        <div className="card border-dashed py-16 text-center text-sm text-slate-500">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
              className="rounded-lg bg-white/5 px-4 py-2 text-slate-200 hover:bg-white/10"
            >
              Previous
            </Link>
          )}
          <span className="text-slate-400">
            Page {page} of {pages}
          </span>
          {page < pages && (
            <Link
              href={makeHref({ q, category, sort, page: String(page + 1) })}
              className="rounded-lg bg-white/5 px-4 py-2 text-slate-200 hover:bg-white/10"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}