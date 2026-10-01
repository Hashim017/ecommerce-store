import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { toCard } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

const CAT_TINTS = ["bg-mint", "bg-lilac", "bg-powder", "bg-sun"];
const SPOTS = [
  "left-0 top-10 -rotate-6",
  "left-28 top-0 z-10 rotate-3",
  "left-56 top-20 rotate-[8deg]",
];
const MARQUEE = [
  "Free shipping",
  "New arrivals",
  "Easy returns",
  "Secure checkout",
  "Fresh picks every week",
];
const PERKS = [
  { icon: Truck, title: "Fast delivery", text: "Free shipping on every order." },
  { icon: ShieldCheck, title: "Secure payments", text: "Your details stay private." },
  { icon: RotateCcw, title: "Easy returns", text: "Changed your mind? No problem." },
];

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
    <div className="space-y-16">
      {/* Hero */}
      <section className="grid items-center gap-10 pt-4 md:grid-cols-2">
        <div>
          <p className="mb-5 inline-block rounded-full border-2 border-ink bg-mint px-4 py-1 text-xs font-bold uppercase tracking-wide">
            New season, new stuff
          </p>
          <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl">
            Stuff you will{" "}
            <span className="inline-block -rotate-2 rounded-xl border-2 border-ink bg-sun px-3">
              actually
            </span>{" "}
            love.
          </h1>
          <p className="mt-6 max-w-md text-lg text-ink/70">
            Electronics, fashion and home picks. Clear prices, quick checkout.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="btn-primary px-6 py-3 text-base">
              Shop now <ArrowRight size={18} />
            </Link>
            <a href="#categories" className="btn-light px-6 py-3 text-base">
              Browse categories
            </a>
          </div>
        </div>

        <div className="relative hidden h-96 md:block">
          {products.slice(0, 3).map((p, i) => (
            <Link
              key={p.id}
              href={`/products/${p.slug}`}
              className={`card absolute w-48 overflow-hidden transition hover:z-20 hover:scale-105 ${SPOTS[i]}`}
            >
              <img
                src={p.imageUrl}
                alt={p.name}
                className="aspect-square w-full object-cover"
              />
              <div className="flex items-center justify-between border-t-2 border-ink bg-white px-3 py-2 text-sm">
                <span className="line-clamp-1 font-semibold">{p.name}</span>
                <span className="font-bold">{formatPrice(Number(p.price))}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Moving banner */}
      <div className="overflow-hidden rounded-2xl border-2 border-ink bg-sun py-3">
        <div className="marquee-track font-display text-lg font-extrabold uppercase">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i} className="mx-6 flex items-center gap-12 whitespace-nowrap">
              {t}
              <Star size={16} className="fill-current" />
            </span>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section id="categories" className="scroll-mt-24">
        <h2 className="font-display mb-6 text-3xl font-extrabold tracking-tight">
          Shop by category
        </h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {categories.map((c, i) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}`}
              className={`card card-hover flex min-h-36 items-end justify-between p-6 ${CAT_TINTS[i % CAT_TINTS.length]}`}
            >
              <div>
                <h3 className="font-display text-2xl font-extrabold">{c.name}</h3>
                <p className="text-sm font-medium text-ink/70">
                  {c._count.products} products
                </p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-white">
                <ArrowUpRight size={18} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section>
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-3xl font-extrabold tracking-tight">
            New arrivals
          </h2>
          <Link href="/products" className="text-sm font-bold underline underline-offset-4 hover:text-coral">
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={toCard(p)} />
          ))}
        </div>
      </section>

      {/* Perks */}
      <section className="grid gap-5 sm:grid-cols-3">
        {PERKS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="card flex items-center gap-4 p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-lilac">
              <Icon size={22} />
            </span>
            <div>
              <h3 className="font-display font-bold">{title}</h3>
              <p className="text-sm text-ink/60">{text}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}