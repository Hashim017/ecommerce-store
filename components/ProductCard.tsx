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

const TINTS = ["bg-sun/60", "bg-mint/60", "bg-lilac/70", "bg-powder/70"];

export default function ProductCard({ product }: { product: ProductCardData }) {
  const soldOut = product.stock === 0;
  const tint = TINTS[product.name.length % TINTS.length];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="card card-hover group flex flex-col p-3"
    >
      <div className={`relative aspect-square overflow-hidden rounded-[1.25rem] ${tint}`}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
        />
        {soldOut && (
          <span className="absolute right-2 top-2 rounded-full bg-coral px-3 py-1 text-xs font-bold text-white">
            Sold out
          </span>
        )}
      </div>
      <div className="flex items-end justify-between gap-2 px-2 pb-2 pt-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-grape">
            {product.categoryName}
          </p>
          <h3 className="font-display mt-0.5 line-clamp-1 text-lg font-semibold">
            {product.name}
          </h3>
        </div>
        <span className="shrink-0 rounded-full bg-gradient-to-r from-grape to-coral px-3 py-1 text-sm font-bold text-white">
          {formatPrice(product.price)}
        </span>
      </div>
    </Link>
  );
}