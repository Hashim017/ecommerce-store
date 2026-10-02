"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function MobileMenu({
  links,
  children,
}: {
  links: { href: string; label: string }[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-lilac/40 transition hover:bg-lilac"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 -z-10"
            onClick={() => setOpen(false)}
          />
          <div className="pop-in absolute left-0 right-0 top-full mt-2 rounded-[2rem] bg-white p-3 shadow-[0_20px_40px_-12px_rgba(124,58,237,0.45)]">
            <nav className="flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-full px-4 py-3 font-bold transition hover:bg-lilac/40 hover:text-grape"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="mt-2 border-t-2 border-lilac/20 pt-3 [&>button]:ml-0 [&>button]:w-full">
              {children}
            </div>
          </div>
        </>
      )}
    </>
  );
}