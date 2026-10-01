import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { toCard } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    }),
  ]);

  return (
    <div className="space-y-14">
      <section className="rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 px-6 py-14 text-center shadow-2xl shadow-indigo-900/40 sm:py-20">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Find something you will love
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-indigo-100">
          Electronics, fashion and home items. Simple prices and fast checkout.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-indigo-700 hover:bg-indigo-50"
        >
          Shop now <ArrowRight size={18} />
        </Link>
      </section>

      <section>
        <h2 className="mb-5 text-2xl font-bold text-white">Shop by category</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}`}
              className="card p-6 transition hover:-translate-y-1"
            >
              <h3 className="text-lg font-semibold text-white">{c.name}</h3>
              <p className="mt-1 text-sm text-slate-400">
                {c._count.products} products
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">New arrivals</h2>
          <Link
            href="/products"
            className="text-sm font-medium text-indigo-300 hover:underline"
          >
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={toCard(p)} />
          ))}
        </div>
      </section>
    </div>
  );
}