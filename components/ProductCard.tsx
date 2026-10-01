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

const TINTS = ["bg-sun", "bg-mint", "bg-lilac", "bg-powder"];

export default function ProductCard({ product }: { product: ProductCardData }) {
  const soldOut = product.stock === 0;
  const tint = TINTS[product.name.length % TINTS.length];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="card card-hover group flex flex-col overflow-hidden"
    >
      <div
        className={`relative aspect-square overflow-hidden border-b-2 border-ink ${tint}`}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <span className="absolute bottom-3 left-3 rounded-full border-2 border-ink bg-white px-3 py-1 text-sm font-bold">
          {formatPrice(product.price)}
        </span>
        {soldOut && (
          <span className="absolute right-3 top-3 rounded-full border-2 border-ink bg-coral px-3 py-1 text-xs font-bold text-white">
            Sold out
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-ink/50">
          {product.categoryName}
        </p>
        <h3 className="font-display mt-1 line-clamp-1 text-lg font-bold">
          {product.name}
        </h3>
      </div>
    </Link>
  );
}