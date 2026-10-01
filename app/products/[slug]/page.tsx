import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/currentUser";
import AddToCartButton from "@/components/AddToCartButton";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

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
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
      >
        <ArrowLeft size={16} /> Back to products
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="card overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div className="space-y-5">
          <Link
            href={`/products?category=${product.category.slug}`}
            className="text-sm font-medium text-indigo-300 hover:underline"
          >
            {product.category.name}
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {product.name}
          </h1>
          <p className="text-3xl font-bold text-white">
            {formatPrice(Number(product.price))}
          </p>

          {soldOut ? (
            <p className="text-sm font-medium text-rose-300">Out of stock</p>
          ) : lowStock ? (
            <p className="text-sm font-medium text-amber-300">
              Only {product.stock} left
            </p>
          ) : (
            <p className="text-sm font-medium text-emerald-300">In stock</p>
          )}

          <p className="leading-relaxed text-slate-400">
            {product.description}
          </p>

                    <AddToCartButton
            productId={product.id}
            soldOut={soldOut}
            loggedIn={!!user}
          />
        </div>
      </div>
    </div>
  );
}