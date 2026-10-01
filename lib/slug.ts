import { prisma } from "@/lib/prisma";

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function uniqueSlug(name: string) {
  const base = slugify(name) || "product";
  let slug = base;
  let n = 2;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${base}-${n}`;
    n++;
  }
  return slug;
}