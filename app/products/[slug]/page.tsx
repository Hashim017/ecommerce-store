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
        className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-4 py-1.5 text-sm font-semibold transition hover:bg-sun"
      >
        <ArrowLeft size={16} /> Back to products
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="card overflow-hidden bg-sun">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div className="space-y-5">
          <Link
            href={`/products?category=${product.category.slug}`}
            className="inline-block rounded-full border-2 border-ink bg-lilac px-3 py-1 text-xs font-bold uppercase tracking-wide"
          >
            {product.category.name}
          </Link>

          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            {product.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <p className="font-display inline-block -rotate-1 rounded-xl border-2 border-ink bg-sun px-4 py-1 text-3xl font-extrabold shadow-[3px_3px_0_#17151f]">
              {formatPrice(Number(product.price))}
            </p>
            {soldOut ? (
              <span className="rounded-full border-2 border-ink bg-coral px-3 py-1 text-xs font-bold text-white">
                Out of stock
              </span>
            ) : lowStock ? (
              <span className="rounded-full border-2 border-ink bg-sun px-3 py-1 text-xs font-bold">
                Only {product.stock} left
              </span>
            ) : (
              <span className="rounded-full border-2 border-ink bg-mint px-3 py-1 text-xs font-bold">
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

          <p className="flex items-center gap-2 text-sm font-medium text-ink/60">
            <Truck size={16} /> Free shipping on every order
          </p>
        </div>
      </div>
    </div>
  );
}