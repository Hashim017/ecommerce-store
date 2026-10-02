"use client";

import { useState } from "react";
import { Banknote } from "lucide-react";
import { formatPrice } from "@/lib/format";
import type { CartLine } from "@/components/CartView";

export default function CheckoutForm({
  items,
  total,
}: {
  items: CartLine[];
  total: number;
}) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, phone, address, city }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    window.location.href = `/orders/${data.id}?placed=1`;
  }

  const label = "mb-1 block text-sm font-bold";

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <form onSubmit={submit} className="card space-y-4 p-6 lg:col-span-2">
        <h2 className="font-display text-2xl font-semibold">Delivery details</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Full name</label>
            <input
              required
              maxLength={80}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className={label}>Phone</label>
            <input
              required
              maxLength={20}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input"
            />
          </div>
        </div>

        <div>
          <label className={label}>Address</label>
          <textarea
            required
            rows={3}
            maxLength={200}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="input"
          />
        </div>

        <div>
          <label className={label}>City</label>
          <input
            required
            maxLength={60}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="input"
          />
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-mint/40 px-4 py-3 text-sm font-bold">
          <Banknote size={20} />
          Cash on delivery. Pay when your order arrives.
        </div>

        {error && (
          <p className="rounded-2xl bg-coral/15 px-4 py-2 text-sm font-bold text-red-700">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
          {loading ? "Placing order..." : `Place order · ${formatPrice(total)}`}
        </button>
      </form>

      <aside className="card h-fit space-y-4 p-6">
        <h2 className="font-display text-2xl font-semibold">Your order</h2>
        <ul className="space-y-3">
          {items.map((i) => (
            <li key={i.id} className="flex items-center gap-3">
              <img
                src={i.imageUrl}
                alt={i.name}
                className="h-14 w-14 rounded-2xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="font-display truncate font-semibold">{i.name}</p>
                <p className="text-xs font-semibold text-ink/60">
                  {i.quantity} x {formatPrice(i.price)}
                </p>
              </div>
              <p className="text-sm font-bold">{formatPrice(i.price * i.quantity)}</p>
            </li>
          ))}
        </ul>
        <div className="font-display flex justify-between border-t-2 border-dashed border-lilac pt-4 text-2xl font-semibold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </aside>
    </div>
  );
}