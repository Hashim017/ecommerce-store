"use client";

import { LogOut } from "lucide-react";

export default function LogoutButton() {
  async function logout() {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      cache: "no-store",
    });

    if (!res.ok) {
      alert("Logout failed. Status: " + res.status);
      return;
    }

    window.location.replace("/");
  }

  return (
    <button
      onClick={logout}
      aria-label="Log out"
      className="ml-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-coral to-sun px-5 py-2 text-sm font-extrabold text-ink shadow-[0_8px_20px_-6px_rgba(255,93,143,0.6)] transition hover:-translate-y-0.5 hover:scale-105 active:scale-95"
    >
      <LogOut size={16} />
      <span className="hidden sm:inline">Log out</span>
    </button>
  );
}