import Link from "next/link";
import { Store, ShoppingCart } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import LogoutButton from "@/components/LogoutButton";

const pill =
  "rounded-full px-3 py-1.5 font-semibold text-ink transition hover:bg-ink hover:text-cream";

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
    <header className="sticky top-0 z-30 border-b-2 border-ink bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 -rotate-6 items-center justify-center rounded-xl border-2 border-ink bg-sun shadow-[2px_2px_0_#17151f]">
            <Store size={20} />
          </span>
          <span className="font-display hidden text-2xl font-extrabold tracking-tight min-[400px]:inline">
            ShopNest
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          <Link href="/" className={`${pill} hidden sm:block`}>
            Home
          </Link>
          <Link href="/products" className={pill}>
            Products
          </Link>
          {user?.role === "ADMIN" && (
            <Link href="/admin" className={pill}>
              Admin
            </Link>
          )}

          <Link
            href="/cart"
            aria-label="Cart"
            className="relative ml-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-white transition hover:bg-sun"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-ink bg-coral px-1 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <LogoutButton />
          ) : (
            <Link href="/login" className="btn-primary ml-2 px-4 py-2">
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}