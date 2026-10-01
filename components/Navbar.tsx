import Link from "next/link";
import { Store, ShoppingCart } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import LogoutButton from "@/components/LogoutButton";

const linkClass =
  "rounded-lg px-3 py-2 text-slate-300 hover:bg-white/5 hover:text-white";

export default async function Navbar() {
  const user = await getCurrentUser();

  let cartCount = 0;
  if (user) {
    const sum = await prisma.cartItem.aggregate({
      where: { userId: user.id },
      _sum: { quantity: true },
    });
    cartCount = sum._sum.quantity ?? 0;
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-900/50">
            <Store size={18} />
          </span>
          <span className="hidden text-lg font-bold text-white min-[400px]:inline">
            ShopNest
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm font-medium">
          <Link href="/" className={linkClass}>
            Home
          </Link>
          <Link href="/products" className={linkClass}>
            Products
          </Link>
          {user?.role === "ADMIN" && (
            <Link href="/admin" className={linkClass}>
              Admin
            </Link>
          )}

          <Link href="/cart" aria-label="Cart" className={`relative ${linkClass}`}>
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-500 px-1 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <LogoutButton />
          ) : (
            <Link href="/login" className="btn-primary ml-1 px-4 py-2">
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}