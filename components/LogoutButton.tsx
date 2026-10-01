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
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-300 hover:bg-white/5 hover:text-rose-300"
    >
      <LogOut size={16} />
      <span className="hidden sm:inline">Log out</span>
    </button>
  );
}