import Link from "next/link";
import { Sparkles, ShoppingBag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import LogoutButton from "@/components/LogoutButton";
import LoginButton from "@/components/LoginButton";

export const dynamic = "force-dynamic";

const pill =
  "rounded-full px-4 py-2 font-bold transition hover:bg-lilac/40 hover:text-grape";

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
    <header className="sticky top-3 z-30 px-3 pt-3">
      <div className="mx-auto flex max-w-5xl items-center justify-between rounded-full bg-white/80 px-3 py-2 shadow-[0_12px_30px_-12px_rgba(124,58,237,0.45)] backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-grape to-coral text-white">
            <Sparkles size={20} />
          </span>
          <span className="font-display hidden text-2xl font-semibold min-[400px]:inline">
            Shop<span className="text-coral">Nest</span>
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
            className="relative ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-sun transition hover:scale-110"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? <LogoutButton /> : <LoginButton />}
        </nav>
      </div>
    </header>
  );
}