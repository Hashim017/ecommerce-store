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
          className="fixed inset-0 z-50 overflow-y-auto bg-ink/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
            <div
              className="pop-in card relative w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-16 bg-gradient-to-br from-grape via-coral to-sun sm:h-24" />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute right-3 top-3 rounded-full bg-white/90 p-2 transition hover:scale-110 sm:right-4 sm:top-4"
              >
                <X size={16} />
              </button>
              <div className="-mt-8 px-5 pb-6 sm:-mt-10 sm:px-8 sm:pb-8">
                <LoginForm modal />
              </div>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}