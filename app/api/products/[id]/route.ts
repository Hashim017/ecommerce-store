import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/apiAuth";
import { parseProduct } from "@/lib/validate";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Ctx) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ ...product, price: Number(product.price) });
}

export async function PUT(request: Request, { params }: Ctx) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  const { id } = await params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

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

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...parsed.data,
      imageUrl: parsed.data.imageUrl || existing.imageUrl,
    },
  });

  return NextResponse.json({ ...product, price: Number(product.price) });
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  const { id } = await params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const inOrders = await prisma.orderItem.count({ where: { productId: id } });
  if (inOrders > 0) {
    return NextResponse.json(
      { error: "This product is in past orders. Set its stock to 0 instead." },
      { status: 409 }
    );
  }

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}