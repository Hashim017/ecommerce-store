import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Ctx) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const quantity = Math.floor(Number(body?.quantity));

  if (!Number.isFinite(quantity) || quantity < 1) {
    return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
  }

  const item = await prisma.cartItem.findUnique({
    where: { id },
    include: { product: true },
  });
  if (!item || item.userId !== user.id) {
    return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
  }
  if (quantity > item.product.stock) {
    return NextResponse.json(
      { error: `Only ${item.product.stock} in stock` },
      { status: 409 }
    );
  }

  const updated = await prisma.cartItem.update({
    where: { id },
    data: { quantity },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const item = await prisma.cartItem.findUnique({ where: { id } });
  if (!item || item.userId !== user.id) {
    return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
  }

  await prisma.cartItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}