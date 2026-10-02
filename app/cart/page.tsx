import { prisma } from "@/lib/prisma";
import { requireCustomer } from "@/lib/currentUser";
import CartView from "@/components/CartView";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const user = await requireCustomer();

  const items = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
    orderBy: { id: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">
        Your{" "}
        <span className="bg-gradient-to-r from-grape via-coral to-sun bg-clip-text text-transparent">
          cart
        </span>
      </h1>
      <CartView
        items={items.map((i) => ({
          id: i.id,
          slug: i.product.slug,
          name: i.product.name,
          imageUrl: i.product.imageUrl,
          price: Number(i.product.price),
          quantity: i.quantity,
          stock: i.product.stock,
        }))}
      />
    </div>
  );
}