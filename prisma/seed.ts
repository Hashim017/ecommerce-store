import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  { name: "Electronics", slug: "electronics" },
  { name: "Fashion", slug: "fashion" },
  { name: "Home", slug: "home" },
];

const products = [
  { name: "Wireless Headphones", cat: "electronics", price: 79.99, stock: 25, description: "Over-ear headphones with deep bass and 30 hours of battery." },
  { name: "Smart Watch", cat: "electronics", price: 129.5, stock: 15, description: "Tracks steps, sleep and heart rate. Works with any phone." },
  { name: "Bluetooth Speaker", cat: "electronics", price: 45, stock: 40, description: "Small, loud and water resistant. Great for trips." },
  { name: "Power Bank 20000mAh", cat: "electronics", price: 29.99, stock: 60, description: "Charges a phone up to 5 times. Two fast USB ports." },
  { name: "Classic Cotton T-Shirt", cat: "fashion", price: 19.99, stock: 100, description: "Soft cotton shirt in a regular fit." },
  { name: "Denim Jacket", cat: "fashion", price: 64, stock: 20, description: "Strong denim jacket that goes with everything." },
  { name: "Running Shoes", cat: "fashion", price: 89.9, stock: 30, description: "Light shoes with a soft sole for daily runs." },
  { name: "Leather Backpack", cat: "fashion", price: 74.5, stock: 12, description: "Roomy backpack with a laptop pocket." },
  { name: "Ceramic Coffee Mug Set", cat: "home", price: 24.99, stock: 50, description: "Set of 4 mugs. Dishwasher safe." },
  { name: "Table Lamp", cat: "home", price: 34, stock: 18, description: "Warm light lamp with a simple wooden base." },
  { name: "Cotton Bed Sheet", cat: "home", price: 39.99, stock: 25, description: "Soft double bed sheet with 2 pillow covers." },
  { name: "Wall Clock", cat: "home", price: 22.5, stock: 35, description: "Quiet wall clock with a clean modern face." },
];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@example.com",
      passwordHash: await bcrypt.hash("admin12345", 10),
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@example.com",
      passwordHash: await bcrypt.hash("password123", 10),
    },
  });

  const ids: Record<string, string> = {};
  for (const c of categories) {
    const created = await prisma.category.create({ data: c });
    ids[c.slug] = created.id;
  }

  for (const p of products) {
    const slug = slugify(p.name);
    await prisma.product.create({
      data: {
        name: p.name,
        slug,
        description: p.description,
        price: p.price,
        stock: p.stock,
        imageUrl: `https://picsum.photos/seed/${slug}/600/600`,
        categoryId: ids[p.cat],
      },
    });
  }

  console.log("Seed done");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());