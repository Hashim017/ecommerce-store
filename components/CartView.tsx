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
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-400/15 text-indigo-300">
          <ShoppingBag size={26} />
        </span>
        <div>
          <h2 className="text-xl font-semibold text-white">Your cart is empty</h2>
          <p className="mt-1 text-sm text-slate-400">
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
          <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            {error}
          </p>
        )}

        <ul className="card divide-y divide-white/5">
          {items.map((i) => (
            <li key={i.id} className="flex gap-4 p-4">
              <Link href={`/products/${i.slug}`} className="shrink-0">
                <img
                  src={i.imageUrl}
                  alt={i.name}
                  className="h-20 w-20 rounded-lg object-cover"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/products/${i.slug}`}
                      className="line-clamp-1 font-medium text-slate-100 hover:text-white"
                    >
                      {i.name}
                    </Link>
                    <p className="text-sm text-slate-400">
                      {formatPrice(i.price)} each
                    </p>
                    {i.quantity >= i.stock && (
                      <p className="text-xs text-amber-300">
                        Only {i.stock} in stock
                      </p>
                    )}
                  </div>
                  <p className="font-semibold text-white">
                    {formatPrice(i.price * i.quantity)}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 rounded-lg bg-white/5 p-1">
                    <button
                      onClick={() => setQuantity(i.id, i.quantity - 1)}
                      disabled={i.quantity <= 1 || busyId === i.id}
                      aria-label="Decrease quantity"
                      className="rounded-md p-1.5 text-slate-300 hover:bg-white/10 disabled:opacity-40"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-white">
                      {i.quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(i.id, i.quantity + 1)}
                      disabled={i.quantity >= i.stock || busyId === i.id}
                      aria-label="Increase quantity"
                      className="rounded-md p-1.5 text-slate-300 hover:bg-white/10 disabled:opacity-40"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => remove(i.id)}
                    disabled={busyId === i.id}
                    aria-label="Remove item"
                    className="rounded-lg p-2 text-slate-500 hover:bg-white/10 hover:text-rose-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <aside className="card h-fit space-y-4 p-5">
        <h2 className="font-semibold text-white">Order summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-400">
            <span>Items ({count})</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Shipping</span>
            <span className="text-emerald-300">Free</span>
          </div>
        </div>
        <div className="flex justify-between border-t border-white/10 pt-4 text-lg font-bold text-white">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        <button disabled className="btn-primary w-full py-3">
          Checkout
        </button>
        <p className="text-center text-xs text-slate-500">
          Checkout starts working in Stage 5.
        </p>
      </aside>
    </div>
  );
}