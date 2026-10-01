"use client";

import { useState } from "react";
import { Store } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    window.location.href = data.role === "ADMIN" ? "/admin" : "/";
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-6">
      <div className="card w-full max-w-md p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-4 flex h-14 w-14 -rotate-6 items-center justify-center rounded-2xl border-2 border-ink bg-sun shadow-[3px_3px_0_#17151f]">
            <Store size={26} />
          </span>
          <h1 className="font-display text-3xl font-extrabold">Welcome back</h1>
          <p className="mt-1 text-sm text-ink/60">Log in to your account.</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-bold">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
          </div>

          {error && (
            <p className="rounded-xl border-2 border-ink bg-coral/15 px-3 py-2 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? "Please wait..." : "Log in"}
          </button>
        </form>

        <div className="mt-5 space-y-1 rounded-xl border-2 border-dashed border-ink bg-mint/40 px-3 py-2 text-center text-xs font-medium">
          <p>Admin: admin@example.com / admin12345</p>
          <p>Customer: demo@example.com / password123</p>
        </div>
      </div>
    </div>
  );
}