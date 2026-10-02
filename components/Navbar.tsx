import Link from "next/link";
import { Sparkles, ShoppingBag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import LogoutButton from "@/components/LogoutButton";
import LoginButton from "@/components/LoginButton";
import MobileMenu from "@/components/MobileMenu";

export const dynamic = "force-dynamic";

const pill =
  "rounded-full px-4 py-2 font-bold transition hover:bg-lilac/40 hover:text-grape";

export default async function Navbar() {
  const user = await getCurrentUser();
  const isAdmin = user?.role === "ADMIN";

  let cartCount = 0;
  if (user && !isAdmin) {
    const sum = await prisma.cartItem.aggregate({
      where: { userId: user.id },
      _sum: { quantity: true },
    });
    cartCount = sum._sum.quantity ?? 0;
  }

  const links = isAdmin
    ? [
        { href: "/products", label: "Store" },
        { href: "/admin", label: "Inventory" },
        { href: "/admin/orders", label: "Sales" },
      ]
    : [
        { href: "/", label: "Home" },
        { href: "/products", label: "Products" },
        ...(user
          ? [
              { href: "/orders", label: "Orders" },
              { href: "/account", label: "Account" },
            ]
          : []),
      ];

  const cart = isAdmin ? null : (
    <Link
      href="/cart"
      aria-label="Cart"
      className="relative flex h-10 w-10 items-center justify-center rounded-full bg-sun transition hover:scale-110"
    >
      <ShoppingBag size={18} />
      {cartCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1 text-[11px] font-bold text-white">
          {cartCount}
        </span>
      )}
    </Link>
  );

  return (
    <header className="sticky top-3 z-30 px-3 pt-3">
      <div className="relative mx-auto flex max-w-5xl items-center justify-between rounded-full bg-white/80 px-3 py-2 shadow-[0_12px_30px_-12px_rgba(124,58,237,0.45)] backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-grape to-coral text-white">
            <Sparkles size={20} />
          </span>
          <span className="font-display text-2xl font-semibold">
            Shop<span className="text-coral">Nest</span>
          </span>
        </Link>

        {/* Wide screens */}
        <nav className="hidden items-center gap-1 text-sm md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={pill}>
              {l.label}
            </Link>
          ))}
          {cart && <div className="ml-1">{cart}</div>}
          {user ? <LogoutButton /> : <LoginButton />}
        </nav>

        {/* Small screens */}
        <div className="flex items-center gap-2 md:hidden">
          {cart}
          <MobileMenu links={links}>
            {user ? (
              <LogoutButton full />
            ) : (
              <LoginButton className="btn-primary py-3" />
            )}
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}