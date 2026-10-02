import Link from "next/link";
import { Package, ShoppingBag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireCustomer } from "@/lib/currentUser";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await requireCustomer();

  const stats = await prisma.order.aggregate({
    where: { userId: user.id },
    _count: true,
    _sum: { total: true },
  });

  const spent = Number(stats._sum.total ?? 0);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-grape via-[#a855f7] to-coral p-8 text-white">
        <div className="float-slow absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/20" />
        <div className="float-slower absolute -bottom-10 right-24 h-28 w-28 rounded-full bg-sun/40" />
        <div className="relative flex flex-wrap items-center gap-5">
          <span className="font-display flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-sun text-4xl font-semibold uppercase text-ink">
            {user.email.charAt(0)}
          </span>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-white/70">
              My account
            </p>
            <h1 className="font-display break-all text-3xl font-semibold">
              {user.email}
            </h1>
            <span className="mt-2 inline-block rounded-full bg-white/25 px-3 py-1 text-xs font-extrabold uppercase">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[1.5rem] bg-lilac p-5 shadow-lg">
          <p className="text-xs font-bold uppercase tracking-wide text-ink/60">
            Orders placed
          </p>
          <p className="font-display text-4xl font-semibold">{stats._count}</p>
        </div>
        <div className="rounded-[1.5rem] bg-mint p-5 shadow-lg">
          <p className="text-xs font-bold uppercase tracking-wide text-ink/60">
            Total spent
          </p>
          <p className="font-display text-4xl font-semibold">{formatPrice(spent)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/orders" className="btn-primary">
          <Package size={16} /> My orders
        </Link>
        <Link href="/cart" className="btn-light">
          <ShoppingBag size={16} /> My cart
        </Link>
      </div>
    </div>
  );
}