import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";

class CancelError extends Error {}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please log in" }, { status: 401 });
  }

  const { id } = await params;

  const order = await prisma.order.findFirst({
    where: { id, userId: user.id },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      const res = await tx.order.updateMany({
        where: { id, userId: user.id, status: "PENDING" },
        data: { status: "CANCELLED" },
      });

      if (res.count === 0) {
        throw new CancelError("Only pending orders can be cancelled");
      }

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof CancelError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Could not cancel the order" }, { status: 500 });
  }
}