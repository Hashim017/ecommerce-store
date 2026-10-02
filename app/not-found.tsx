import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#ede9fe] via-[#fce7f3] to-[#fef3c7] px-6 py-16 text-center">
      <div className="float-slow absolute -left-8 top-8 h-32 w-32 rounded-full bg-lilac/60" />
      <div className="float-slower absolute -right-6 bottom-8 h-40 w-40 rounded-full bg-sun/60" />
      <div className="relative">
        <p className="font-display bg-gradient-to-r from-grape via-coral to-sun bg-clip-text text-8xl font-semibold text-transparent sm:text-9xl">
          404
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold">
          This page got lost
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-ink/70">
          The page you want does not exist. Let us take you back to the store.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
            Go home
          </Link>
          <Link href="/products" className="btn-light">
            Browse products
          </Link>
        </div>
      </div>
    </div>
  );
}