import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Truck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import { formatPrice } from "@/lib/format";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) notFound();

  const user = await getCurrentUser();
  const soldOut = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="space-y-6">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold shadow transition hover:scale-105 hover:bg-lilac/40"
      >
        <ArrowLeft size={16} /> Back to products
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#ede9fe] via-[#fce7f3] to-[#fef3c7] p-5">
          <div className="float-slow absolute -left-3 -top-3 h-16 w-16 rounded-full bg-sun/70" />
          <div className="float-slower absolute -bottom-3 -right-3 h-20 w-20 rounded-full bg-mint/70" />
          <img
            src={product.imageUrl}
            alt={product.name}
            className="relative aspect-square w-full rounded-[2rem] object-cover shadow-xl"
          />
        </div>

        <div className="space-y-5">
          <Link
            href={`/products?category=${product.category.slug}`}
            className="inline-block rounded-full bg-lilac/60 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide text-grape transition hover:bg-lilac"
          >
            {product.category.name}
          </Link>

          <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
            {product.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <p className="font-display inline-block -rotate-2 rounded-full bg-gradient-to-r from-grape to-coral px-6 py-2 text-3xl font-semibold text-white shadow-lg">
              {formatPrice(Number(product.price))}
            </p>
            {soldOut ? (
              <span className="rounded-full bg-coral px-3 py-1.5 text-xs font-bold text-white">
                Out of stock
              </span>
            ) : lowStock ? (
              <span className="rounded-full bg-sun px-3 py-1.5 text-xs font-bold">
                Only {product.stock} left
              </span>
            ) : (
              <span className="rounded-full bg-mint px-3 py-1.5 text-xs font-bold">
                In stock
              </span>
            )}
          </div>

          <p className="text-lg leading-relaxed text-ink/70">
            {product.description}
          </p>

          <AddToCartButton
            productId={product.id}
            soldOut={soldOut}
            loggedIn={!!user}
          />

          <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-ink/70 shadow">
            <Truck size={16} /> Free shipping on every order
          </p>
        </div>
      </div>
    </div>
  );
}