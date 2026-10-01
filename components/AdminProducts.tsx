"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { formatPrice } from "@/lib/format";

export type AdminProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: string;
  categoryName: string;
};

export type AdminCategory = { id: string; name: string };

type FormState = {
  id?: string;
  name: string;
  price: string;
  stock: string;
  categoryId: string;
  imageUrl: string;
  description: string;
};

const label = "mb-1 block text-sm font-bold";

export default function AdminProducts({
  products,
  categories,
}: {
  products: AdminProduct[];
  categories: AdminCategory[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function openNew() {
    setError("");
    setForm({
      name: "",
      price: "",
      stock: "10",
      categoryId: categories[0]?.id ?? "",
      imageUrl: "",
      description: "",
    });
  }

  function openEdit(p: AdminProduct) {
    setError("");
    setForm({
      id: p.id,
      name: p.name,
      price: String(p.price),
      stock: String(p.stock),
      categoryId: p.categoryId,
      imageUrl: p.imageUrl,
      description: p.description,
    });
  }

  async function save() {
    if (!form) return;
    setSaving(true);
    setError("");

    const res = await fetch(
      form.id ? `/api/products/${form.id}` : "/api/products",
      {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price),
          stock: Number(form.stock),
          categoryId: form.categoryId,
          imageUrl: form.imageUrl,
          description: form.description,
        }),
      }
    );

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong");
      return;
    }

    setForm(null);
    router.refresh();
  }

  async function remove(p: AdminProduct) {
    if (!confirm(`Delete "${p.name}"?`)) return;
    const res = await fetch(`/api/products/${p.id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Could not delete");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Manage products
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            {products.length} products in your store.
          </p>
        </div>
        <button onClick={openNew} className="btn-primary">
          <Plus size={16} /> Add product
        </button>
      </div>

      <ul className="card divide-y-2 divide-ink/10">
        {products.map((p) => (
          <li
            key={p.id}
            className="flex items-center gap-3 px-4 py-3 hover:bg-cream/60"
          >
            <img
              src={p.imageUrl}
              alt={p.name}
              className="h-14 w-14 shrink-0 rounded-xl border-2 border-ink object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="font-display truncate font-bold">{p.name}</p>
              <p className="truncate text-xs text-ink/60">
                {p.categoryName} · Stock: {p.stock}
              </p>
            </div>
            <p className="font-bold">{formatPrice(p.price)}</p>
            <div className="flex gap-1">
              <button
                onClick={() => openEdit(p)}
                aria-label="Edit"
                className="rounded-full p-2 transition hover:bg-sun"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => remove(p)}
                aria-label="Delete"
                className="rounded-full p-2 transition hover:bg-coral/20 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {form && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/60 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
            className="card my-8 w-full max-w-lg space-y-4 bg-cream p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl font-extrabold">
                {form.id ? "Edit product" : "Add product"}
              </h3>
              <button
                type="button"
                onClick={() => setForm(null)}
                aria-label="Close"
                className="rounded-full border-2 border-ink bg-white p-1.5 hover:bg-sun"
              >
                <X size={16} />
              </button>
            </div>

            <div>
              <label className={label}>Name</label>
              <input
                required
                maxLength={100}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label}>Price</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className={label}>Stock</label>
                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className={label}>Category</label>
              <select
                required
                value={form.categoryId}
                onChange={(e) =>
                  setForm({ ...form, categoryId: e.target.value })
                }
                className="input"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={label}>Image link, optional</label>
              <input
                value={form.imageUrl}
                onChange={(e) =>
                  setForm({ ...form, imageUrl: e.target.value })
                }
                placeholder="https://..."
                className="input"
              />
              <p className="mt-1 text-xs text-ink/50">
                Leave empty to get a sample image.
              </p>
            </div>

            <div>
              <label className={label}>Description</label>
              <textarea
                required
                rows={3}
                maxLength={1000}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="input"
              />
            </div>

            {error && (
              <p className="rounded-xl border-2 border-ink bg-coral/15 px-3 py-2 text-sm font-semibold text-red-700">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setForm(null)}
                className="btn-light"
              >
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}