"use client";

import { LogOut } from "lucide-react";

export default function LogoutButton() {
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", cache: "no-store" });
    window.location.href = "/";
  }

  return (
    <button
      onClick={logout}
      className="flex items-center gap-2 rounded-full px-3 py-1.5 font-semibold transition hover:bg-ink hover:text-cream"
    >
      <LogOut size={16} />
      <span className="hidden sm:inline">Log out</span>
    </button>
  );
}