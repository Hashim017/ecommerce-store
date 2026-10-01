import type { Prisma } from "@prisma/client";
import type { ProductCardData } from "@/components/ProductCard";

export type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { category: true };
}>;

export function toCard(p: ProductWithCategory): ProductCardData {
  return {
    slug: p.slug,
    name: p.name,
    price: Number(p.price),
    imageUrl: p.imageUrl,
    stock: p.stock,
    categoryName: p.category.name,
  };
}