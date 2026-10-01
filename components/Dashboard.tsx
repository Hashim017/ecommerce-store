import Link from "next/link";
import { ArrowRight, ShoppingBag, Wallet, Layers, Settings } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { toCard } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import ProductCard from "@/components/ProductCard";

const CHIP_COLORS = ["bg-mint", "bg-lilac", "bg-powder", "bg-sun"];

export default async function Dashboard({
  user,
}: {
  user: { id: string; role: string };
}) {
  const [products, categories, cartItems] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.cartItem.findMany({
      where: { userId: user.id },
      include: { product: true },
      take: 50,
    }),
  ]);

  const count = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const total = cartItems.reduce(
    (sum, i) => sum + Number(i.product.price) * i.quantity,
    0
  );

  const stats = [
    { icon: ShoppingBag, label: "Items in cart", value: String(count), color: "bg-sun" },
    { icon: Wallet, label: "Cart total", value: formatPrice(total), color: "bg-mint" },
    { icon: Layers, label: "Categories", value: String(categories.length), color: "bg-lilac" },
  ];

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Welcome */}
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-grape via-[#a855f7] to-coral p-8 text-white">
            <div className="float-slow absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/20" />
            <div className="float-slower absolute -bottom-10 right-24 h-28 w-28 rounded-full bg-sun/40" />
            <div className="relative">
              <p className="text-sm font-bold uppercase tracking-wide text-white/70">
                Your space
              </p>
              <h1 className="font-display mt-1 text-4xl font-semibold sm:text-5xl">
                Welcome back!
              </h1>
              <p className="mt-2 max-w-sm text-white/80">
                Pick up where you left off, or find something new.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/products" className="btn-light">
                  Continue shopping <ArrowRight size={16} />
                </Link>
                {user.role === "ADMIN" && (
                  <Link href="/admin" className="btn-light">
                    <Settings size={16} /> Open admin
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="card flex items-center gap-4 p-5">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${color}`}
                >
                  <Icon size={22} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide text-ink/50">
                    {label}
                  </p>
                  <p className="font-display truncate text-2xl font-semibold">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart panel */}
        <aside className="card flex flex-col gap-4 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold">Your cart</h2>
            <span className="rounded-full bg-sun px-3 py-1 text-xs font-bold">
              {count} {count === 1 ? "item" : "items"}
            </span>
          </div>

          {cartItems.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl bg-lilac/20 py-10 text-center">
              <p className="text-sm font-semibold text-ink/60">
                Nothing here yet.
              </p>
              <Link href="/products" className="btn-light">
                Browse products
              </Link>
            </div>
          ) : (
            <>
              <ul className="space-y-3">
                {cartItems.slice(0, 3).map((i) => (
                  <li key={i.id} className="flex items-center gap-3">
                    <img
                      src={i.product.imageUrl}
                      alt={i.product.name}
                      className="h-14 w-14 rounded-2xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-display truncate font-semibold">
                        {i.product.name}
                      </p>
                      <p className="text-xs font-semibold text-ink/60">
                        {i.quantity} x {formatPrice(Number(i.product.price))}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              {cartItems.length > 3 && (
                <p className="text-xs font-semibold text-ink/50">
                  and {cartItems.length - 3} more
                </p>
              )}
              <Link href="/cart" className="btn-primary mt-auto w-full">
                View cart
              </Link>
            </>
          )}
        </aside>
      </section>

      {/* Categories */}
      <section>
        <h2 className="font-display mb-4 text-3xl font-semibold">Jump to</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((c, i) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}`}
              className={`rounded-full px-5 py-2.5 font-bold shadow transition hover:scale-105 ${CHIP_COLORS[i % CHIP_COLORS.length]}`}
            >
              {c.name} · {c._count.products}
            </Link>
          ))}
        </div>
      </section>

      {/* Fresh picks */}
      <section>
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-3xl font-semibold">Fresh picks</h2>
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
    </div>
  );
}