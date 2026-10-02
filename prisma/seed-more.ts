import type { PrismaClient } from "@prisma/client";

type Seed = {
  name: string;
  price: number;
  stock: number;
  description: string;
};

const DATA: Record<"electronics" | "fashion" | "home", { label: string; items: Seed[] }> = {
  electronics: {
    label: "Electronics",
    items: [
      { name: "Wireless Earbuds Pro", price: 59.99, stock: 25, description: "Clear sound, deep bass and a charging case that lasts all day." },
      { name: "Smart Fitness Watch", price: 79.0, stock: 18, description: "Tracks steps, sleep and heart rate with a bright color screen." },
      { name: "Bluetooth Speaker Mini", price: 34.5, stock: 40, description: "Small, loud and water resistant. Easy to take anywhere." },
      { name: "Mechanical Keyboard", price: 89.0, stock: 12, description: "Tactile switches and soft backlight for long typing sessions." },
      { name: "Gaming Mouse RGB", price: 29.99, stock: 30, description: "Fast sensor, comfy grip and bright color lights." },
      { name: "Power Bank 20000mAh", price: 39.0, stock: 3, description: "Charge your phone up to five times on one full charge." },
      { name: "Full HD Webcam", price: 44.0, stock: 15, description: "Sharp video for calls and classes with a built in microphone." },
      { name: "USB-C Hub 7 in 1", price: 36.0, stock: 22, description: "HDMI, USB ports and a card reader in one small hub." },
      { name: "Portable SSD 1TB", price: 109.0, stock: 0, description: "Very fast storage that fits in your pocket." },
      { name: "LED Desk Lamp", price: 24.99, stock: 5, description: "Three light modes and a bendy neck for study or work." },
    ],
  },
  fashion: {
    label: "Fashion",
    items: [
      { name: "Classic Denim Jacket", price: 64.0, stock: 14, description: "A strong everyday jacket that goes with everything." },
      { name: "White Everyday Sneakers", price: 54.99, stock: 28, description: "Clean look, soft sole and easy to wash." },
      { name: "Canvas Backpack", price: 38.0, stock: 20, description: "Room for a laptop, books and lunch. Strong zippers." },
      { name: "Cotton Zip Hoodie", price: 42.0, stock: 33, description: "Soft inside, warm and relaxed fit." },
      { name: "Aviator Sunglasses", price: 22.5, stock: 45, description: "Light frame with UV protection for sunny days." },
      { name: "Slim Leather Wallet", price: 27.0, stock: 4, description: "Holds cards and cash without making your pocket bulky." },
      { name: "Soft Wool Scarf", price: 19.99, stock: 17, description: "Warm, light and available in a bold color." },
      { name: "Running Shorts", price: 18.0, stock: 36, description: "Quick dry fabric with a zip pocket for your keys." },
      { name: "Baseball Cap", price: 14.5, stock: 0, description: "Simple cap with an adjustable strap." },
      { name: "Analog Wrist Watch", price: 69.0, stock: 9, description: "Classic round face with a comfortable leather strap." },
    ],
  },
  home: {
    label: "Home",
    items: [
      { name: "Ceramic Mug Set of 4", price: 26.0, stock: 24, description: "Four colorful mugs, safe for the microwave and dishwasher." },
      { name: "Scented Candle Trio", price: 21.99, stock: 31, description: "Three calm scents to make any room feel cozy." },
      { name: "Fluffy Throw Blanket", price: 32.0, stock: 16, description: "Super soft blanket for the sofa or the bed." },
      { name: "Bamboo Cutting Board", price: 17.5, stock: 27, description: "Strong, light and gentle on your knives." },
      { name: "Steel Water Bottle", price: 15.0, stock: 50, description: "Keeps drinks cold for a day and hot for hours." },
      { name: "Modern Wall Clock", price: 23.0, stock: 8, description: "Silent clock with a clean design for any wall." },
      { name: "Plant Pot Set of 3", price: 28.0, stock: 19, description: "Three pots in different sizes with drainage trays." },
      { name: "Memory Foam Pillow", price: 35.0, stock: 2, description: "Supports your neck and keeps its shape night after night." },
      { name: "Woven Storage Basket", price: 20.0, stock: 21, description: "Hide clutter in style. Good for towels, toys or books." },
      { name: "Desk Organizer Tray", price: 16.0, stock: 0, description: "Keeps pens, notes and small tools in one tidy place." },
    ],
  },
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function findCategory(prisma: PrismaClient, key: string, label: string) {
  const all = await prisma.category.findMany();
  const found = all.find(
    (c) => c.slug.toLowerCase().includes(key) || c.name.toLowerCase().includes(key)
  );
  if (found) return found;

  return prisma.category.create({ data: { name: label, slug: key } });
}

export async function seedMoreProducts(prisma: PrismaClient) {
  const marker = slugify(DATA.electronics.items[0].name);
  const done = await prisma.product.findUnique({ where: { slug: marker } });

  if (done) {
    console.log("Extra products already added. Skipping.");
    return;
  }

  let added = 0;

  for (const [key, group] of Object.entries(DATA)) {
    const category = await findCategory(prisma, key, group.label);

    for (const item of group.items) {
      const slug = slugify(item.name);

      const existing = await prisma.product.findUnique({ where: { slug } });
      if (existing) continue;

      await prisma.product.create({
        data: {
          name: item.name,
          slug,
          description: item.description,
          price: item.price,
          stock: item.stock,
          imageUrl: `https://picsum.photos/seed/${slug}/600/600`,
          categoryId: category.id,
        },
      });
      added++;
    }
  }

  console.log(`Added ${added} extra products.`);
}