import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";

class CheckoutError extends Error {}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please log in" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const fullName = String(body.fullName ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const address = String(body.address ?? "").trim();
  const city = String(body.city ?? "").trim();

  if (fullName.length < 2 || fullName.length > 80) {
    return NextResponse.json({ error: "Enter your full name" }, { status: 400 });
  }
  if (phone.length < 7 || phone.length > 20) {
    return NextResponse.json({ error: "Enter a valid phone number" }, { status: 400 });
  }
  if (address.length < 5 || address.length > 200) {
    return NextResponse.json({ error: "Enter your full address" }, { status: 400 });
  }
  if (city.length < 2 || city.length > 60) {
    return NextResponse.json({ error: "Enter your city" }, { status: 400 });
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      const cart = await tx.cartItem.findMany({
        where: { userId: user.id },
        include: { product: true },
      });

      if (cart.length === 0) {
        throw new CheckoutError("Your cart is empty");
      }

      let total = 0;
      for (const i of cart) {
        const res = await tx.product.updateMany({
          where: { id: i.productId, stock: { gte: i.quantity } },
          data: { stock: { decrement: i.quantity } },
        });
        if (res.count === 0) {
          throw new CheckoutError(`Not enough stock for ${i.product.name}`);
        }
        total += Number(i.product.price) * i.quantity;
      }

      const created = await tx.order.create({
        data: {
          userId: user.id,
          total,
          fullName,
          phone,
          address,
          city,
          items: {
            create: cart.map((i) => ({
              productId: i.productId,
              name: i.product.name,
              price: i.product.price,
              quantity: i.quantity,
              imageUrl: i.product.imageUrl,
            })),
          },
        },
      });

      await tx.cartItem.deleteMany({ where: { userId: user.id } });
      return created;
    });

    return NextResponse.json({ id: order.id });
  } catch (err) {
    if (err instanceof CheckoutError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Could not place the order" }, { status: 500 });
  }
}