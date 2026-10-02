import Link from "next/link";
import { Inbox } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/currentUser";
import { formatPrice } from "@/lib/format";
import { STATUS_STYLE, statusStyle, formatDate } from "@/lib/orderStatus";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const filter = sp.status && sp.status in STATUS_STYLE ? sp.status : "";

  const all = await prisma.order.findMany({
    include: { user: true, items: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const orders = filter ? all.filter((o) => o.status === filter) : all;

  const pending = all.filter((o) => o.status === "PENDING").length;
  const revenue = all
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + Number(o.total), 0);

  const stats = [
    { label: "All orders", value: String(all.length), color: "bg-lilac" },
    { label: "Pending", value: String(pending), color: "bg-sun" },
    { label: "Revenue", value: formatPrice(revenue), color: "bg-mint" },
  ];

  const chip = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-bold shadow transition hover:scale-105 ${
      active
        ? "bg-gradient-to-r from-grape to-coral text-white"
        : "bg-white hover:bg-lilac/40"
    }`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">
          Manage{" "}
          <span className="bg-gradient-to-r from-grape via-coral to-sun bg-clip-text text-transparent">
            orders
          </span>
        </h1>
        <Link href="/admin" className="btn-light">
          Manage products
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-[1.5rem] p-5 shadow-lg ${s.color}`}>
            <p className="text-xs font-bold uppercase tracking-wide text-ink/60">
              {s.label}
            </p>
            <p className="font-display text-4xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link href="/admin/orders" className={chip(!filter)}>
          All
        </Link>
        {Object.entries(STATUS_STYLE).map(([key, s]) => (
          <Link
            key={key}
            href={`/admin/orders?status=${key}`}
            className={chip(filter === key)}
          >
            {s.label}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-lilac to-powder">
            <Inbox size={28} />
          </span>
          <p className="font-bold text-ink/60">No orders here.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => {
            const s = statusStyle(o.status);
            const count = o.items.reduce((sum, i) => sum + i.quantity, 0);
            return (
              <li key={o.id}>
                <Link
                  href={`/admin/orders/${o.id}`}
                  className="card card-hover flex flex-wrap items-center gap-4 p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg font-semibold">
                      #{o.id.slice(-6).toUpperCase()} · {o.user.name}
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