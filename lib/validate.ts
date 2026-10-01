type Parsed =
  | {
      ok: true;
      data: {
        name: string;
        description: string;
        price: number;
        stock: number;
        imageUrl: string;
        categoryId: string;
      };
    }
  | { ok: false; error: string };

function fail(error: string): Parsed {
  return { ok: false, error };
}

export function parseProduct(body: unknown): Parsed {
  if (!body || typeof body !== "object") return fail("Invalid body");
  const b = body as Record<string, unknown>;

  const name = String(b.name ?? "").trim();
  const description = String(b.description ?? "").trim();
  const imageUrl = String(b.imageUrl ?? "").trim();
  const categoryId = String(b.categoryId ?? "");
  const price = Number(b.price);
  const stock = Number(b.stock);

  if (!name || name.length > 100) return fail("Name is required (max 100 characters)");
  if (!description || description.length > 1000)
    return fail("Description is required (max 1000 characters)");
  if (!Number.isFinite(price) || price <= 0 || price > 1000000)
    return fail("Price must be more than 0");
  if (!Number.isInteger(stock) || stock < 0 || stock > 100000)
    return fail("Stock must be a whole number, 0 or more");
  if (imageUrl && !/^https?:\/\//i.test(imageUrl))
    return fail("Image link must start with http:// or https://");
  if (!categoryId) return fail("Choose a category");

  return {
    ok: true,
    data: {
      name,
      description,
      price: Math.round(price * 100) / 100,
      stock,
      imageUrl,
      categoryId,
    },
  };
}