import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-slate-500 sm:flex-row">
        <p>Built with Next.js, Prisma and PostgreSQL.</p>
        <div className="flex gap-4">
          <Link href="/" className="hover:text-white">Home</Link>
          <Link href="/products" className="hover:text-white">Products</Link>
        </div>
      </div>
    </footer>
  );
}