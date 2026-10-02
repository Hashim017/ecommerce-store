import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/currentUser";
import { formatPrice } from "@/lib/format";
import { statusStyle, formatDate } from "@/lib/orderStatus";
import OrderStatusSelect from "@/components/OrderStatusSelect";

export const dynamic = "force-dynamic";

export default async function AdminOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: true, items: true },
  });

  if (!order) notFound();

  const s = statusStyle(order.status);

  return (
    <div className="space-y-6">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold shadow transition hover:scale-105 hover:bg-lilac/40"
      >
        <ArrowLeft size={16} /> All orders
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-semibold">
            Order #{order.id.slice(-6).toUpperCase()}
          </h1>
          <p className="text-sm font-semibold text-ink/60">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <span className={`rounded-full px-4 py-1.5 text-sm font-extrabold ${s.className}`}>
          {s.label}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ul className="card divide-y-2 divide-lilac/20 lg:col-span-2">
          {order.items.map((i) => (
            <li key={i.id} className="flex items-center gap-4 p-4">
              {i.imageUrl ? (
                <img
                  src={i.imageUrl}
                  alt={i.name}
                  className="h-20 w-20 rounded-2xl object-cover"
                />
              ) : (
                <div className="h-20 w-20 rounded-2xl bg-lilac/40" />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-display truncate text-lg font-semibold">{i.name}</p>
                <p className="text-sm font-semibold text-ink/60">
                  {i.quantity} x {formatPrice(Number(i.price))}
                </p>
              </div>
              <p className="font-display text-lg font-semibold">
                {formatPrice(Number(i.price) * i.quantity)}
              </p>
            </li>
          ))}
        </ul>

        <aside className="space-y-4">
          <div className="card space-y-3 p-5">
            <h2 className="font-display text-xl font-semibold">Status</h2>
            <OrderStatusSelect orderId={order.id} current={order.status} />
          </div>

          <div className="card space-y-1 p-5 text-sm">
            <h2 className="font-display mb-2 text-xl font-semibold">Customer</h2>
            <p className="font-bold">{order.user.name}</p>
            <p className="break-all font-semibold text-ink/70">{order.user.email}</p>
          </div>

          <div className="card space-y-1 p-5 text-sm">
            <h2 className="font-display mb-2 text-xl font-semibold">Delivery</h2>
            <p className="font-bold">{order.fullName || order.user.name}</p>
            {order.phone && <p className="font-semibold text-ink/70">{order.phone}</p>}
            <p className="font-semibold text-ink/70">{order.address}</p>
            {order.city && <p className="font-semibold text-ink/70">{order.city}</p>}
          </div>

          <div className="card flex justify-between p-5">
            <span className="font-display text-xl font-semibold">Total</span>
            <span className="font-display text-xl font-semibold">
              {formatPrice(Number(order.total))}
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}