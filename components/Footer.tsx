import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mx-3 mb-3 mt-10 overflow-hidden rounded-[2rem] bg-gradient-to-br from-grape via-[#a855f7] to-coral text-white">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-4xl font-semibold">ShopNest</p>
          <p className="mt-2 max-w-xs text-sm text-white/80">
            A simple full-stack store built with Next.js, Prisma and PostgreSQL.
          </p>
        </div>
        <nav className="flex gap-3 text-sm font-bold">
          <Link href="/" className="rounded-full bg-white/20 px-4 py-2 hover:bg-white/30">
            Home
          </Link>
          <Link href="/products" className="rounded-full bg-white/20 px-4 py-2 hover:bg-white/30">
            Products
          </Link>
          <Link href="/cart" className="rounded-full bg-white/20 px-4 py-2 hover:bg-white/30">
            Cart
          </Link>
        </nav>
      </div>
    </footer>
  );
}