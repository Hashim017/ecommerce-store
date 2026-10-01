"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { X } from "lucide-react";
import LoginForm from "@/components/LoginForm";

const AuthContext = createContext({ openLogin: () => {} });

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AuthContext.Provider value={{ openLogin: () => setOpen(true) }}>
      {children}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="pop-in card relative w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-24 bg-gradient-to-br from-grape via-coral to-sun" />
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full bg-white/90 p-2 transition hover:scale-110"
            >
              <X size={16} />
            </button>
            <div className="-mt-10 px-8 pb-8">
              <LoginForm modal />
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}