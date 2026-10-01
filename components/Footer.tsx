import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-10 border-t-2 border-ink bg-ink text-cream">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 px-4 py-10 sm:flex-row sm:items-end">
        <div>
          <p className="font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
            Shop<span className="text-sun">Nest</span>
          </p>
          <p className="mt-2 max-w-xs text-sm text-cream/60">
            A simple full-stack store built with Next.js, Prisma and PostgreSQL.
          </p>
        </div>
        <nav className="flex gap-6 text-sm font-semibold">
          <Link href="/" className="hover:text-sun">
            Home
          </Link>
          <Link href="/products" className="hover:text-sun">
            Products
          </Link>
          <Link href="/cart" className="hover:text-sun">
            Cart
          </Link>
        </nav>
      </div>
    </footer>
  );
}