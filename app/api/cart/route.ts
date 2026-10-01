import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
    orderBy: { id: "asc" },
  });

  return NextResponse.json(
    items.map((i) => ({
      id: i.id,
      quantity: i.quantity,
      product: { ...i.product, price: Number(i.product.price) },
    }))
  );
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const productId = String(body?.productId ?? "");
  const quantity = Math.floor(Number(body?.quantity ?? 1));

  if (!productId || !Number.isFinite(quantity) || quantity < 1) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  if (product.stock === 0) {
    return NextResponse.json({ error: "This product is sold out" }, { status: 409 });
  }

  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
  });

  const newQuantity = (existing?.quantity ?? 0) + quantity;
  if (newQuantity > product.stock) {
    return NextResponse.json(
      { error: `Only ${product.stock} in stock` },
      { status: 409 }
    );
  }

  const item = await prisma.cartItem.upsert({
    where: { userId_productId: { userId: user.id, productId } },
    update: { quantity: newQuantity },
    create: { userId: user.id, productId, quantity },
  });

  return NextResponse.json(item, { status: 201 });
}