"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Check } from "lucide-react";

export default function AddToCartButton({
  productId,
  soldOut,
  loggedIn,
}: {
  productId: string;
  soldOut: boolean;
  loggedIn: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  async function add() {
    if (!loggedIn) {
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    setError("");
    setAdded(false);

    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    const data = await res.json().catch(() => ({}));

    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      return;
    }

    setAdded(true);
    router.refresh();
  }

  return (
    <div className="space-y-2">
      <button
        onClick={add}
        disabled={soldOut || loading}
        className="btn-primary px-6 py-3"
      >
        {added ? <Check size={18} /> : <ShoppingCart size={18} />}
        {soldOut
          ? "Sold out"
          : loading
          ? "Adding..."
          : added
          ? "Added to cart"
          : "Add to cart"}
      </button>
      {error && <p className="text-sm text-rose-300">{error}</p>}
      {!loggedIn && !soldOut && (
        <p className="text-xs text-slate-500">Log in to add items to your cart.</p>
      )}
    </div>
  );
}   