import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/currentUser";
import AdminProducts from "@/components/AdminProducts";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <AdminProducts
      products={products.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: Number(p.price),
        stock: p.stock,
        imageUrl: p.imageUrl,
        categoryId: p.categoryId,
        categoryName: p.category.name,
      }))}
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
    />
  );
}