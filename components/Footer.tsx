import Link from "next/link";
import { getCurrentUser } from "@/lib/currentUser";

export default async function Footer() {
  const user = await getCurrentUser();
  const isAdmin = user?.role === "ADMIN";

  const link =
    "rounded-full bg-white/20 px-4 py-2 transition hover:bg-white/30";

  return (
    <footer className="mx-3 mb-3 mt-10 overflow-hidden rounded-[2rem] bg-gradient-to-br from-grape via-[#a855f7] to-coral text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-8 text-center sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-10 sm:text-left">
        <div>
          <p className="font-display text-3xl font-semibold sm:text-4xl">
            ShopNest
          </p>
          <p className="mx-auto mt-2 max-w-xs text-sm text-white/80 sm:mx-0">
            A simple full-stack store built with Next.js, Prisma and PostgreSQL.
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-2 text-sm font-bold sm:justify-end sm:gap-3">
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