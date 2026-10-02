import Link from "next/link";
import { Package } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/currentUser";
import { formatPrice } from "@/lib/format";
import { statusStyle, formatDate } from "@/lib/orderStatus";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const user = await requireUser();

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">
        My{" "}
        <span className="bg-gradient-to-r from-grape via-coral to-sun bg-clip-text text-transparent">
          orders
        </span>
      </h1>

      {orders.length === 0 ? (
        <div className="card flex flex-col items-center gap-4 py-20 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-lilac to-powder">
            <Package size={32} />
          </span>
          <div>
            <h2 className="font-display text-3xl font-semibold">No orders yet</h2>
            <p className="mt-1 text-sm text-ink/60">
              Your orders will show here after checkout.
            </p>
          </div>
          <Link href="/products" className="btn-primary">
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => {
            const s = statusStyle(o.status);
            const count = o.items.reduce((sum, i) => sum + i.quantity, 0);
            return (
              <li key={o.id}>
                <Link
                  href={`/orders/${o.id}`}
                  className="card card-hover flex flex-wrap items-center gap-4 p-5"
                >
                  <div className="flex -space-x-3">
                    {o.items.slice(0, 3).map((i) => (
                      <img
                        key={i.id}
                        src={i.imageUrl}
                        alt={i.name}
                        className="h-14 w-14 rounded-full border-4 border-white object-cover"
                      />
                    ))}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg font-semibold">
                      Order #{o.id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-sm font-semibold text-ink/60">
                      {formatDate(o.createdAt)} · {count} {count === 1 ? "item" : "items"}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${s.className}`}>
                    {s.label}
                  </span>
                  <p className="font-display text-xl font-semibold">
                    {formatPrice(Number(o.total))}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}