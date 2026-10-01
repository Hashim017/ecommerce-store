"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Check } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

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
  const { openLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  async function add() {
    if (!loggedIn) {
      openLogin();
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
        className="btn-primary w-full px-8 py-3.5 text-base sm:w-auto"
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
      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      {!loggedIn && !soldOut && (
        <p className="text-xs font-medium text-ink/50">
          Log in to add items to your cart.
        </p>
      )}
    </div>
  );
}