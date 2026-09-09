import "dotenv/config";

import { db } from "./db";

/*
 * --------------------------------------------------
 * SIZE GROUPS
 * --------------------------------------------------
 */

const WOMEN_CLOTHING_SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
];

const MEN_CLOTHING_SIZES = [
  "S",
  "M",
  "L",
  "XL",
  "2XL",
];

const JEANS_SIZES = [
  "28",
  "30",
  "32",
  "34",
  "36",
  "38",
];

const ONE_SIZE = [
  "ONE_SIZE",
];

/*
 * --------------------------------------------------
 * TYPES
 * --------------------------------------------------
 */

interface CreateProductInput {
  sku: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  imageUrl: string;
  categoryId: number;

  /*
   * Total stock for the product.
   *
   * This will be distributed across
   * all variants.
   */
  quantity: number;

  sizes: string[];
}

/*
 * --------------------------------------------------
 * CATEGORY HELPER
 * --------------------------------------------------
 *
 * Create the category only when it
 * does not already exist.
 */

async function getOrCreateCategory(
  name: string,
  parentId: number | null = null,
) {
  const existingCategory =
    await db.orm.public.Category.first({
      name,
      parentId,
    });

  if (existingCategory) {
    return existingCategory;
  }

  return db.orm.public.Category.create({
    name,
    parentId,
  });
}

/*
 * --------------------------------------------------
 * VARIANT + INVENTORY HELPER
 * --------------------------------------------------
 *
 * Product
 *    ↓
 * ProductVariant
 *    ↓
 * Inventory
 */

async function createOrUpdateVariants(
  productId: number,
  productSku: string,
  sizes: string[],
  totalQuantity: number,
) {
  if (sizes.length === 0) {
    throw new Error(
      `Product ${productSku} must have at least one variant`,
    );
  }

  /*
   * Distribute total stock across
   * all sizes.
   *
   * Example:
   *
   * quantity = 28
   * sizes = 5
   *
   * baseQuantity = 5
   * remainder = 3
   *
   * Result:
   * 6, 6, 6, 5, 5
   */

  const baseQuantity =
    Math.floor(
      totalQuantity /
        sizes.length,
    );

  const remainder =
    totalQuantity %
    sizes.length;

  for (
    let index = 0;
    index < sizes.length;
    index++
  ) {
    const size =
      sizes[index];

    if (!size) {
      continue;
    }

    const variantSku =
      `${productSku}-${size}`;

    const quantity =
      baseQuantity +
      (index < remainder ? 1 : 0);

    /*
     * --------------------------------
     * CREATE / UPDATE VARIANT
     * --------------------------------
     */

    let variant =
      await db.orm.public.ProductVariant.first({
        productId,
        size,
      });

    if (variant) {
      variant =
        await db.orm.public.ProductVariant
          .where({
            id: variant.id,
          })
          .update({
            sku: variantSku,
          });
    } else {
      variant =
        await db.orm.public.ProductVariant.create({
          sku: variantSku,
          size,
          productId,
        });
    }

    if (!variant) {
      throw new Error(
        `Could not create/update variant: ${variantSku}`,
      );
    }

    /*
     * --------------------------------
     * CREATE / UPDATE VARIANT STOCK
     * --------------------------------
     *
     * Inventory now belongs to the
     * ProductVariant, not Product.
     */

    const inventory =
      await db.orm.public.Inventory.first({
        variantId:
          variant.id,
      });

    if (inventory) {
      await db.orm.public.Inventory
        .where({
          id: inventory.id,
        })
        .update({
          quantity,
        });
    } else {
      await db.orm.public.Inventory.create({
        variantId:
          variant.id,
        quantity,
      });
    }
  }
}

/*
 * --------------------------------------------------
 * PRODUCT HELPER
 * --------------------------------------------------
 */

async function createProduct({
  sku,
  name,
  description,
  price,
  rating,
  imageUrl,
  categoryId,
  quantity,
  sizes,
}: CreateProductInput) {
  /*
   * Find product through its unique SKU.
   */

  let product =
    await db.orm.public.Product.first({
      sku,
    });

  /*
   * Update when product already exists.
   */

  if (product) {
    product =
      await db.orm.public.Product
        .where({
          id: product.id,
        })
        .update({
          name,
          description,
          price,
          rating,
          imageUrl,
          categoryId,
        });
  }

  /*
   * Otherwise create the product.
   */

  else {
    product =
      await db.orm.public.Product.create({
        sku,
        name,
        description,
        price,
        rating,
        imageUrl,
        categoryId,
      });
  }

  if (!product) {
    throw new Error(
      `Could not create/update product: ${sku}`,
    );
  }

  /*
   * Create/update sizes and their
   * inventory.
   */

  await createOrUpdateVariants(
    product.id,
    sku,
    sizes,
    quantity,
  );

  return product;
}

/*
 * --------------------------------------------------
 * MAIN SEED
 * --------------------------------------------------
 */

async function main() {
  console.log(
    "🌱 Starting ShoppingHighway database seed...",
  );

  /*
   * ==================================================
   * 1. TOP-LEVEL CATEGORIES
   * ==================================================
   */

  const women =
    await getOrCreateCategory(
      "Women",
    );

  const men =
    await getOrCreateCategory(
      "Men",
    );

  const accessories =
    await getOrCreateCategory(
      "Accessories",
    );

  /*
   * ==================================================
   * 2. CHILD CATEGORIES
   * ==================================================
   */

  const dresses =
    await getOrCreateCategory(
      "Dresses",
      women.id,
    );

  const tops =
    await getOrCreateCategory(
      "Tops",
      women.id,
    );

  const shirts =
    await getOrCreateCategory(
      "Shirts",
      men.id,
    );

  const jackets =
    await getOrCreateCategory(
      "Jackets",
      men.id,
    );

  const jeans =
    await getOrCreateCategory(
      "Jeans",
      men.id,
    );

  const handbags =
    await getOrCreateCategory(
      "Handbags",
      accessories.id,
    );

  const jewelry =
    await getOrCreateCategory(
      "Jewelry",
      accessories.id,
    );

  const scarves =
    await getOrCreateCategory(
      "Scarves",
      accessories.id,
    );

  /*
   * ==================================================
   * 3. WOMEN — DRESSES
   * ==================================================
   */

  await createProduct({
    sku: "WDR-FMD-001",
    name: "Floral Midi Dress",

    description:
      "Elegant floral midi dress designed for casual and semi-formal occasions.",

    price: 349900,
    rating: 4.6,

    imageUrl:
      "/products/floral-midi-dress.jpg",

    categoryId:
      dresses.id,

    quantity: 25,

    sizes:
      WOMEN_CLOTHING_SIZES,
  });

  await createProduct({
    sku: "WDR-EMD-002",
    name: "Evening Maxi Dress",

    description:
      "Flowing maxi dress suitable for evening events and special occasions.",

    price: 499900,
    rating: 4.8,

    imageUrl:
      "/products/evening-maxi-dress.jpg",

    categoryId:
      dresses.id,

    quantity: 15,

    sizes:
      WOMEN_CLOTHING_SIZES,
  });

  /*
   * ==================================================
   * 4. WOMEN — TOPS
   * ==================================================
   */

  await createProduct({
    sku: "WTP-SBL-001",
    name: "Satin Blouse",

    description:
      "Soft satin blouse with an elegant finish.",

    price: 219900,
    rating: 4.4,

    imageUrl:
      "/products/satin-blouse.jpg",

    categoryId:
      tops.id,

    quantity: 30,

    sizes:
      WOMEN_CLOTHING_SIZES,
  });

  await createProduct({
    sku: "WTP-CCT-002",
    name: "Cotton Crop Top",

    description:
      "Comfortable lightweight cotton crop top for everyday wear.",

    price: 129900,
    rating: 4.2,

    imageUrl:
      "/products/cotton-crop-top.jpg",

    categoryId:
      tops.id,

    quantity: 40,

    sizes:
      WOMEN_CLOTHING_SIZES,
  });

  /*
   * ==================================================
   * 5. MEN — SHIRTS
   * ==================================================
   */

  await createProduct({
    sku: "MSH-CLS-001",
    name: "Classic Linen Shirt",

    description:
      "Breathable premium linen shirt with a classic fit.",

    price: 249900,
    rating: 4.5,

    imageUrl:
      "/products/classic-linen-shirt.jpg",

    categoryId:
      shirts.id,

    quantity: 35,

    sizes:
      MEN_CLOTHING_SIZES,
  });

  await createProduct({
    sku: "MSH-OXF-002",
    name: "Slim Fit Oxford Shirt",

    description:
      "Smart slim-fit Oxford shirt for formal and casual styling.",

    price: 279900,
    rating: 4.7,

    imageUrl:
      "/products/slim-fit-oxford-shirt.jpg",

    categoryId:
      shirts.id,

    quantity: 28,

    sizes:
      MEN_CLOTHING_SIZES,
  });

  await createProduct({
    sku: "MSH-CBS-004",
    name: "Casual Brown Shirt",

    description:
      "Casual brown shirt with a clean everyday silhouette.",

    price: 239900,
    rating: 4.5,

    imageUrl:
      "/products/casual-brown-shirt.webp",

    categoryId:
      shirts.id,

    quantity: 30,

    sizes:
      MEN_CLOTHING_SIZES,
  });

  await createProduct({
    sku: "MSH-OWS-005",
    name: "Oversized White Shirt",

    description:
      "Relaxed oversized white shirt with a minimalist finish.",

    price: 259900,
    rating: 4.6,

    imageUrl:
      "/products/oversized-white-shirt.webp",

    categoryId:
      shirts.id,

    quantity: 26,

    sizes:
      MEN_CLOTHING_SIZES,
  });

  /*
   * ==================================================
   * 6. MEN — JACKETS
   * ==================================================
   */

  await createProduct({
    sku: "MJK-DNM-001",
    name: "Classic Denim Jacket",

    description:
      "Timeless denim jacket with a comfortable everyday fit.",

    price: 399900,
    rating: 4.6,

    imageUrl:
      "/products/classic-denim-jacket.jpg",

    categoryId:
      jackets.id,

    quantity: 20,

    sizes:
      MEN_CLOTHING_SIZES,
  });

  /*
   * ==================================================
   * 7. MEN — JEANS
   * ==================================================
   */

  await createProduct({
    sku: "MJN-SBJ-001",
    name: "Baggy Jeans",

    description:
      "Fit denim jeans for everyday casual wear.",

    price: 289900,
    rating: 4.5,

    imageUrl:
      "/products/mens-baggy-jeans.webp",

    categoryId:
      jeans.id,

    quantity: 30,

    sizes:
      JEANS_SIZES,
  });

  await createProduct({
    sku: "MJN-RFJ-002",
    name: "Relaxed Baggy Jeans",

    description:
      "Relaxed baggy jeans with a comfortable everyday fit.",

    price: 319900,
    rating: 4.4,

    imageUrl:
      "/products/mens-baggy-jean-fade.webp",

    categoryId:
      jeans.id,

    quantity: 24,

    sizes:
      JEANS_SIZES,
  });

  await createProduct({
    sku: "MJN-BDJ-003",
    name: "Black Denim Jeans",

    description:
      "Free black denim jeans with a clean modern finish.",

    price: 299900,
    rating: 4.6,

    imageUrl:
      "/products/mens-baggy-jean-black.webp",

    categoryId:
      jeans.id,

    quantity: 28,

    sizes:
      JEANS_SIZES,
  });

  await createProduct({
    sku: "MJN-SFJ-004",
    name: "Straight Fit Jeans",

    description:
      "Straight fit jeans designed for versatile casual styling.",

    price: 279900,
    rating: 4.3,

    imageUrl:
      "/products/blue-baggy-jeans.webp",

    categoryId:
      jeans.id,

    quantity: 32,

    sizes:
      JEANS_SIZES,
  });

  await createProduct({
    sku: "MJN-WDJ-005",
    name: "Washed Denim Jeans",

    description:
      "Washed denim jeans with a relaxed contemporary look.",

    price: 329900,
    rating: 4.7,

    imageUrl:
      "/products/mens-baggy-jean-soft.webp",

    categoryId:
      jeans.id,

    quantity: 20,

    sizes:
      JEANS_SIZES,
  });

  /*
   * ==================================================
   * 8. ACCESSORIES — HANDBAGS
   * ==================================================
   */

  await createProduct({
    sku: "AHB-LTH-001",
    name: "Leather Handbag",

    description:
      "Elegant boutique-style handbag with spacious compartments.",

    price: 459900,
    rating: 4.8,

    imageUrl:
      "/products/leather-handbag.jpg",

    categoryId:
      handbags.id,

    quantity: 18,

    sizes:
      ONE_SIZE,
  });

  /*
   * ==================================================
   * 9. ACCESSORIES — JEWELRY
   * ==================================================
   */

  await createProduct({
    sku: "AJW-GPN-001",
    name: "Gold-Plated Necklace",

    description:
      "Minimal gold-plated necklace designed for everyday elegance.",

    price: 179900,
    rating: 4.3,

    imageUrl:
      "/products/gold-plated-necklace.jpg",

    categoryId:
      jewelry.id,

    quantity: 45,

    sizes:
      ONE_SIZE,
  });

  /*
   * ==================================================
   * 10. ACCESSORIES — SCARVES
   * ==================================================
   */

  await createProduct({
    sku: "ASC-SLK-001",
    name: "Printed Silk Scarf",

    description:
      "Lightweight printed silk scarf with a premium finish.",

    price: 149900,
    rating: 4.5,

    imageUrl:
      "/products/printed-silk-scarf.jpg",

    categoryId:
      scarves.id,

    quantity: 32,

    sizes:
      ONE_SIZE,
  });

  console.log(
    "✅ ShoppingHighway database seeded successfully.",
  );
}

/*
 * --------------------------------------------------
 * RUN SEED
 * --------------------------------------------------
 */

main()
  .catch((error) => {
    console.error(
      "❌ Database seeding failed:",
    );

    console.error(error);

    process.exitCode = 1;
  })
  .finally(async () => {
    await db.close();
  });