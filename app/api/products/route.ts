import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/apiAuth";
import { parseProduct } from "@/lib/validate";
import { uniqueSlug } from "@/lib/slug";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const category = searchParams.get("category") ?? "";

  const products = await prisma.product.findMany({
    where: {
      ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {}),
      ...(category ? { category: { slug: category } } : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(
    products.map((p) => ({ ...p, price: Number(p.price) }))
  );
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  const body = await request.json().catch(() => null);
  const parsed = parseProduct(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const category = await prisma.category.findUnique({
    where: { id: parsed.data.categoryId },
  });
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 400 });
  }

  const slug = await uniqueSlug(parsed.data.name);

  const product = await prisma.product.create({
    data: {
      ...parsed.data,
      slug,
      imageUrl:
        parsed.data.imageUrl || `https://picsum.photos/seed/${slug}/600/600`,
    },
  });

  return NextResponse.json(
    { ...product, price: Number(product.price) },
    { status: 201 }
  );
}