"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { STATUS_STYLE } from "@/lib/orderStatus";
import { useDialog } from "@/components/DialogProvider";

export default function OrderStatusSelect({
  orderId,
  current,
}: {
  orderId: string;
  current: string;
}) {
  const router = useRouter();
  const { confirmBox } = useDialog();
  const [status, setStatus] = useState(current);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const locked = current === "CANCELLED";

  async function save() {
    if (status === current) return;

    if (status === "CANCELLED") {
      const ok = await confirmBox({
        title: "Cancel this order?",
        message: "The stock will go back to the products.",
        confirmText: "Yes, cancel it",
        danger: true,
      });
      if (!ok) return;
    }

    setLoading(true);
    setError("");

    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json().catch(() => ({}));

    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      return;
    }

    router.refresh();
  }

  return (
    <div className="space-y-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        disabled={locked || loading}
        className="input"
      >
        {Object.entries(STATUS_STYLE).map(([key, s]) => (
          <option key={key} value={key}>
            {s.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="rounded-2xl bg-coral/15 px-4 py-2 text-sm font-bold text-red-700">
          {error}
        </p>
      )}

      <button
        onClick={save}
        disabled={locked || loading || status === current}
        className="btn-primary w-full"
      >
        {loading ? "Saving..." : "Update status"}
      </button>

      {locked && (
        <p className="text-xs font-semibold text-ink/50">
          A cancelled order cannot be changed.
        </p>
      )}
    </div>
  );
}