import Link from "next/link";
import { formatPrice } from "@/lib/format";

export type ProductCardData = {
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
  categoryName: string;
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  const soldOut = product.stock === 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="card group overflow-hidden transition hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden bg-white/5">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        {soldOut && (
          <span className="absolute left-3 top-3 rounded-full bg-rose-500/90 px-3 py-1 text-xs font-medium text-white">
            Sold out
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs font-medium text-indigo-300">
          {product.categoryName}
        </p>
        <h3 className="mt-1 line-clamp-1 font-semibold text-white">
          {product.name}
        </h3>
        <p className="mt-2 text-lg font-bold text-white">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}