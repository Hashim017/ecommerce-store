import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, PartyPopper } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/currentUser";
import { formatPrice } from "@/lib/format";
import { statusStyle, formatDate } from "@/lib/orderStatus";
import CancelOrderButton from "@/components/CancelOrderButton";

export const dynamic = "force-dynamic";

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ placed?: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const sp = await searchParams;

  const order = await prisma.order.findFirst({
    where: { id, userId: user.id },
    include: { items: true },
  });

  if (!order) notFound();

  const s = statusStyle(order.status);

  return (
    <div className="space-y-6">
      <Link
        href="/orders"
        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold shadow transition hover:scale-105 hover:bg-lilac/40"
      >
        <ArrowLeft size={16} /> All orders
      </Link>

      {sp.placed && (
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-grape via-[#a855f7] to-coral p-8 text-white">
          <div className="float-slow absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/20" />
          <div className="relative flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-grape">
              <PartyPopper size={26} />
            </span>
            <div>
              <h2 className="font-display text-3xl font-semibold">
                Thank you! Your order is placed.
              </h2>
              <p className="text-white/80">
                Keep your cash ready. You pay when it arrives.
              </p>
            </div>
          </div>
        </div>
      )}

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
              <img
                src={i.imageUrl}
                alt={i.name}
                className="h-20 w-20 rounded-2xl object-cover"
              />
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
          <div className="card space-y-1 p-5 text-sm">
            <h2 className="font-display mb-2 text-xl font-semibold">Delivery</h2>
            <p className="font-bold">{order.fullName}</p>
            <p className="font-semibold text-ink/70">{order.phone}</p>
            <p className="font-semibold text-ink/70">{order.address}</p>
            <p className="font-semibold text-ink/70">{order.city}</p>
          </div>

          <div className="card space-y-3 p-5">
            <div className="flex justify-between text-sm font-semibold">
              <span>Payment</span>
              <span>Cash on delivery</span>
            </div>
            <div className="flex justify-between text-sm font-semibold">
              <span>Shipping</span>
              <span className="rounded-full bg-mint px-2 py-0.5 text-xs font-extrabold">
                Free
              </span>
            </div>
            <div className="font-display flex justify-between border-t-2 border-dashed border-lilac pt-3 text-2xl font-semibold">
              <span>Total</span>
              <span>{formatPrice(Number(order.total))}</span>
            </div>
          </div>

          {order.status === "PENDING" && (
            <CancelOrderButton orderId={order.id} />
          )}
        </aside>
      </div>
    </div>
  );
}