import Link from "next/link";
import { getCurrentUser } from "@/lib/currentUser";

export default async function Footer() {
  const user = await getCurrentUser();
  const isAdmin = user?.role === "ADMIN";

  const link = "rounded-full bg-white/20 px-4 py-2 hover:bg-white/30";

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
          {isAdmin ? (
            <>
              <Link href="/admin" className={link}>
                Inventory
              </Link>
              <Link href="/admin/orders" className={link}>
                Sales
              </Link>
              <Link href="/products" className={link}>
                Store
              </Link>
            </>
          ) : (
            <>
              <Link href="/" className={link}>
                Home
              </Link>
              <Link href="/products" className={link}>
                Products
              </Link>
              <Link href="/cart" className={link}>
                Cart
              </Link>
            </>
          )}
        </nav>
      </div>
    </footer>
  );
}