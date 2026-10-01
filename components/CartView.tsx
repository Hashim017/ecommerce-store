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
        <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink bg-lilac">
          <ShoppingBag size={28} />
        </span>
        <div>
          <h2 className="font-display text-2xl font-extrabold">
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
          <p className="rounded-xl border-2 border-ink bg-coral/15 px-3 py-2 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}

        <ul className="card divide-y-2 divide-ink/10">
          {items.map((i) => (
            <li key={i.id} className="flex gap-4 p-4">
              <Link href={`/products/${i.slug}`} className="shrink-0">
                <img
                  src={i.imageUrl}
                  alt={i.name}
                  className="h-24 w-24 rounded-xl border-2 border-ink object-cover"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/products/${i.slug}`}
                      className="font-display line-clamp-1 text-lg font-bold hover:text-coral"
                    >
                      {i.name}
                    </Link>
                    <p className="text-sm text-ink/60">
                      {formatPrice(i.price)} each
                    </p>
                    {i.quantity >= i.stock && (
                      <p className="text-xs font-semibold text-amber-700">
                        Only {i.stock} in stock
                      </p>
                    )}
                  </div>
                  <p className="font-display text-lg font-extrabold">
                    {formatPrice(i.price * i.quantity)}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 rounded-full border-2 border-ink bg-white p-1">
                    <button
                      onClick={() => setQuantity(i.id, i.quantity - 1)}
                      disabled={i.quantity <= 1 || busyId === i.id}
                      aria-label="Decrease quantity"
                      className="rounded-full p-1.5 transition hover:bg-sun disabled:opacity-30"
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
                      className="rounded-full p-1.5 transition hover:bg-sun disabled:opacity-30"
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

      <aside className="card h-fit space-y-4 bg-sun p-6">
        <h2 className="font-display text-xl font-extrabold">Order summary</h2>
        <div className="space-y-2 text-sm font-medium">
          <div className="flex justify-between">
            <span>Items ({count})</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="font-bold">Free</span>
          </div>
        </div>
        <div className="font-display flex justify-between border-t-2 border-dashed border-ink pt-4 text-2xl font-extrabold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        <button disabled className="btn-primary w-full py-3">
          Checkout
        </button>
        <p className="text-center text-xs font-medium text-ink/60">
          Checkout starts working in Stage 5.
        </p>
      </aside>
    </div>
  );
}