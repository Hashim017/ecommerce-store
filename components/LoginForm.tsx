"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import PasswordInput from "@/components/PasswordInput";

type Mode = "login" | "register";

export default function LoginForm({
  modal = false,
  initialMode = "login",
}: {
  modal?: boolean;
  initialMode?: Mode;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!isLogin && password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const res = await fetch(
      isLogin ? "/api/auth/login" : "/api/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isLogin ? { email, password } : { name, email, password }
        ),
      }
    );
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    window.location.href = data.role === "ADMIN" ? "/admin" : "/";
  }

  const tab = (active: boolean) =>
    `flex-1 rounded-full py-2 text-sm font-extrabold transition ${active ? "bg-white text-grape shadow" : "text-ink/60 hover:text-ink"
    }`;

  const content = (
    <>
      <div className="mb-5 flex flex-col items-center text-center">
        <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-grape to-coral text-white shadow-lg sm:mb-3 sm:h-16 sm:w-16">
          <Sparkles size={26} />
        </span>
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">
          {isLogin ? "Welcome back" : "Join ShopNest"}
        </h1>
        <p className="mt-1 text-sm text-ink/60">
          {isLogin ? "Log in to your account." : "Make an account in a few seconds."}
        </p>
      </div>

      <div className="mb-5 flex rounded-full bg-lilac/30 p-1">
        <button type="button" onClick={() => switchMode("login")} className={tab(isLogin)}>
          Log in
        </button>
        <button type="button" onClick={() => switchMode("register")} className={tab(!isLogin)}>
          Register
        </button>
      </div>

      <form onSubmit={submit} className="space-y-3 sm:space-y-4">
        {!isLogin && (
          <div>
            <label className="mb-1 block text-sm font-bold">Name</label>
            <input
              required
              maxLength={60}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
          </div>
        )}
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
          <PasswordInput
            minLength={isLogin ? undefined : 8}
            autoComplete={isLogin ? "current-password" : "new-password"}
            value={password}
            onChange={setPassword}
          />
          {!isLogin && (
            <p className="mt-1 text-xs font-semibold text-ink/50">
              At least 8 characters.
            </p>
          )}
        </div>
        {!isLogin && (
          <div>
            <label className="mb-1 block text-sm font-bold">Confirm password</label>
            <PasswordInput
              autoComplete="new-password"
              value={confirm}
              onChange={setConfirm}
            />
          </div>
        )}

        {error && (
          <p className="rounded-2xl bg-coral/15 px-4 py-2 text-sm font-bold text-red-700">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full py-3">
          {loading ? "Please wait..." : isLogin ? "Log in" : "Create account"}
        </button>
      </form>

      {isLogin && (
        <div className="mt-5 space-y-1 rounded-2xl bg-lilac/30 px-3 py-2 text-center text-xs font-semibold">
          <p>Admin: admin@example.com / admin12345</p>
          <p>Customer: demo@example.com / password123</p>
        </div>
      )}
    </>
  );

  if (modal) return content;

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-6">
      <div className="card w-full max-w-md p-8">{content}</div>
    </div>
  );
}