import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireCustomer } from "@/lib/currentUser";
import CheckoutForm from "@/components/CheckoutForm";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const user = await requireCustomer();

  const cart = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
  });

  if (cart.length === 0) redirect("/cart");

  const items = cart.map((i) => ({
    id: i.id,
    slug: i.product.slug,
    name: i.product.name,
    imageUrl: i.product.imageUrl,
    price: Number(i.product.price),
    quantity: i.quantity,
    stock: i.product.stock,
  }));

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">
        <span className="bg-gradient-to-r from-grape via-coral to-sun bg-clip-text text-transparent">
          Checkout
        </span>
      </h1>
      <CheckoutForm items={items} total={total} />
    </div>
  );
}