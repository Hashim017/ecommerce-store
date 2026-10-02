"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CancelOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function cancel() {
    if (!confirm("Cancel this order?")) return;

    setLoading(true);
    setError("");

    const res = await fetch(`/api/orders/${orderId}/cancel`, { method: "POST" });
    const data = await res.json().catch(() => ({}));

    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      return;
    }

    router.refresh();
  }

  return (
    <div className="space-y-2">
      <button
        onClick={cancel}
        disabled={loading}
        className="btn-light w-full text-red-600"
      >
        {loading ? "Cancelling..." : "Cancel order"}
      </button>
      {error && (
        <p className="rounded-2xl bg-coral/15 px-4 py-2 text-sm font-bold text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}