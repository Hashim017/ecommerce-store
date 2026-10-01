import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Star,
  Search,
  ShoppingBag,
  Gift,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { toCard } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import LoginButton from "@/components/LoginButton";

const CAT_GRADIENTS = [
  "from-[#c4b5fd] to-[#93c5fd]",
  "from-[#ffd23f] to-[#ff9bb5]",
  "from-[#5eead4] to-[#93c5fd]",
  "from-[#ff9bb5] to-[#c4b5fd]",
];

const MARQUEE = [
  "Free shipping",
  "New arrivals",
  "Easy returns",
  "Secure checkout",
  "Fresh picks every week",
];

const STEPS = [
  { icon: Search, title: "Pick", text: "Find something you love.", color: "bg-sun", tilt: "md:-rotate-2" },
  { icon: ShoppingBag, title: "Add", text: "Put it in your cart.", color: "bg-mint", tilt: "md:rotate-1" },
  { icon: Gift, title: "Enjoy", text: "We bring it to your door.", color: "bg-lilac", tilt: "md:rotate-2" },
];

export default async function Landing() {
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
    <div className="space-y-20">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#ede9fe] via-[#fce7f3] to-[#fef3c7] px-6 pb-12 pt-14 text-center">
        <div className="float-slow absolute -left-10 top-10 h-40 w-40 rounded-full bg-lilac/60" />
        <div className="float-slower absolute -right-8 bottom-10 h-48 w-48 rounded-full bg-sun/60" />
        <div className="float-slow absolute right-1/4 top-6 h-16 w-16 rounded-full bg-mint/70" />

        <span className="float-slower absolute left-[8%] top-[45%] hidden -rotate-12 rounded-full bg-sun px-4 py-2 text-sm font-extrabold shadow-lg md:block">
          Free shipping
        </span>
        <span className="float-slow absolute right-[8%] top-[30%] hidden rotate-12 rounded-full bg-mint px-4 py-2 text-sm font-extrabold shadow-lg md:block">
          New!
        </span>

        <div className="relative">
          <p className="mx-auto mb-5 inline-block rounded-full bg-white px-4 py-1.5 text-sm font-bold text-grape shadow">
            New season, new stuff
          </p>
          <h1 className="font-display mx-auto max-w-3xl text-5xl font-semibold leading-[1.05] sm:text-7xl">
            Find things that make you{" "}
            <span className="bg-gradient-to-r from-grape via-coral to-sun bg-clip-text text-transparent">
              smile
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-lg text-ink/70">
            Electronics, fashion and home picks. Clear prices, quick checkout.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/products" className="btn-primary px-7 py-3.5 text-base">
              Shop now <ArrowRight size={18} />
            </Link>
            <a href="#categories" className="btn-light px-7 py-3.5 text-base">
              Browse categories
            </a>
          </div>
        </div>

        <div className="relative mt-12 hidden justify-center gap-5 md:flex">
          {products.slice(0, 4).map((p, i) => (
            <Link
              key={p.id}
              href={`/products/${p.slug}`}
              className={`${i % 2 === 0 ? "float-slow" : "float-slower"} h-44 w-44 overflow-hidden rounded-full border-4 border-white shadow-xl transition hover:scale-110`}
            >
              <img
                src={p.imageUrl}
                alt={p.name}
                className="h-full w-full object-cover"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Moving banner */}
      <div className="overflow-hidden rounded-full bg-gradient-to-r from-grape via-coral to-sun py-3 text-white shadow-lg">
        <div className="marquee-track font-display text-lg font-semibold uppercase">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i} className="mx-6 flex items-center gap-12 whitespace-nowrap">
              {t}
              <Star size={16} className="fill-current" />
            </span>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section id="categories" className="scroll-mt-28">
        <h2 className="font-display mb-6 text-center text-4xl font-semibold">
          Shop by category
        </h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {categories.map((c, i) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}`}
              className={`card-hover flex min-h-40 items-end justify-between rounded-[2rem] bg-gradient-to-br p-6 shadow-lg ${CAT_GRADIENTS[i % CAT_GRADIENTS.length]}`}
            >
              <div>
                <h3 className="font-display text-3xl font-semibold">{c.name}</h3>
                <p className="text-sm font-bold text-ink/60">
                  {c._count.products} products
                </p>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white">
                <ArrowUpRight size={18} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section>
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-4xl font-semibold">Trending now</h2>
          <Link
            href="/products"
            className="rounded-full bg-white px-4 py-2 text-sm font-bold text-grape shadow hover:bg-lilac/40"
          >
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={toCard(p)} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section>
        <h2 className="font-display mb-8 text-center text-4xl font-semibold">
          How it works
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text, color, tilt }, i) => (
            <div
              key={title}
              className={`rounded-[2rem] p-7 shadow-lg transition hover:scale-105 ${color} ${tilt}`}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
                <Icon size={24} />
              </span>
              <p className="font-display mt-5 text-3xl font-semibold">
                {i + 1}. {title}
              </p>
              <p className="mt-1 font-semibold text-ink/70">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Join banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-grape via-[#a855f7] to-coral px-6 py-14 text-center text-white">
        <div className="float-slow absolute -left-6 -top-6 h-28 w-28 rounded-full bg-white/20" />
        <div className="float-slower absolute -bottom-8 right-10 h-36 w-36 rounded-full bg-sun/40" />
        <div className="relative">
          <h2 className="font-display text-4xl font-semibold sm:text-5xl">
            Ready to start shopping?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/80">
            Log in to save your cart and check out fast.
          </p>
          <div className="mt-7">
            <LoginButton
              label="Log in to start"
              className="btn-light px-8 py-3.5 text-base"
            />
          </div>
        </div>
      </section>
    </div>
  );
}