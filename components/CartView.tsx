"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/format";

export type CartLine = {
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  stock: number;
};

export default function CartView({ items }: { items: CartLine[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  async function setQuantity(id: string, quantity: number) {
    setBusyId(id);
    setError("");
    const res = await fetch(`/api/cart/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    setBusyId("");

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong");
      return;
    }
    router.refresh();
  }

  async function remove(id: string) {
    setBusyId(id);
    setError("");
    const res = await fetch(`/api/cart/${id}`, { method: "DELETE" });
    setBusyId("");

    if (!res.ok) {
      setError("Could not remove the item");
      return;
    }
    router.refresh();
  }

  if (items.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-4 py-20 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-lilac to-powder">
          <ShoppingBag size={32} />
        </span>
        <div>
          <h2 className="font-display text-3xl font-semibold">
            Your cart is empty
          </h2>
          <p className="mt-1 text-sm text-ink/60">
            Add something you like and it will show here.
          </p>
        </div>
        <Link href="/products" className="btn-primary">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        {error && (
          <p className="rounded-2xl bg-coral/15 px-4 py-2 text-sm font-bold text-red-700">
            {error}
          </p>
        )}

        <ul className="space-y-4">
          {items.map((i) => (
            <li key={i.id} className="card flex gap-4 p-4">
              <Link href={`/products/${i.slug}`} className="shrink-0">
                <img
                  src={i.imageUrl}
                  alt={i.name}
                  className="h-24 w-24 rounded-2xl object-cover"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/products/${i.slug}`}
                      className="font-display line-clamp-1 text-lg font-semibold hover:text-grape"
                    >
                      {i.name}
                    </Link>
                    <p className="text-sm text-ink/60">
                      {formatPrice(i.price)} each
                    </p>
                    {i.quantity >= i.stock && (
                      <p className="text-xs font-bold text-amber-700">
                        Only {i.stock} in stock
                      </p>
                    )}
                  </div>
                  <p className="font-display text-lg font-semibold">
                    {formatPrice(i.price * i.quantity)}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 rounded-full bg-lilac/30 p-1">
                    <button
                      onClick={() => setQuantity(i.id, i.quantity - 1)}
                      disabled={i.quantity <= 1 || busyId === i.id}
                      aria-label="Decrease quantity"
                      className="rounded-full bg-white p-1.5 shadow transition hover:bg-sun disabled:opacity-30"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">
                      {i.quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(i.id, i.quantity + 1)}
                      disabled={i.quantity >= i.stock || busyId === i.id}
                      aria-label="Increase quantity"
                      className="rounded-full bg-white p-1.5 shadow transition hover:bg-sun disabled:opacity-30"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => remove(i.id)}
                    disabled={busyId === i.id}
                    aria-label="Remove item"
                    className="rounded-full p-2 text-ink/50 transition hover:bg-coral/15 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <aside className="relative h-fit space-y-4 overflow-hidden rounded-[2rem] bg-gradient-to-br from-grape via-[#a855f7] to-coral p-6 text-white shadow-xl">
        <div className="float-slow absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/20" />
        <h2 className="font-display relative text-2xl font-semibold">
          Order summary
        </h2>
        <div className="relative space-y-2 text-sm font-semibold">
          <div className="flex justify-between">
            <span>Items ({count})</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="rounded-full bg-mint px-2 py-0.5 text-xs font-extrabold text-ink">
              Free
            </span>
          </div>
        </div>
        <div className="font-display relative flex justify-between border-t-2 border-dashed border-white/40 pt-4 text-2xl font-semibold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        <Link href="/checkout" className="btn-light relative w-full py-3">
          Checkout
        </Link>
        <p className="relative text-center text-xs font-semibold text-white/80">
          Pay with cash when your order arrives.
        </p>
      </aside>
    </div>
  );
}