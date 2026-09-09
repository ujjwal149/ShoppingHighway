import { z } from "zod";

export const productSchema = z.object({
  id: z.number(),
  sku: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  rating: z.number(),
  imageUrl: z.string(),
  categoryId: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const productPaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  hasNextPage: z.boolean(),
});

export const productResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(productSchema),
  pagination: productPaginationSchema,
});

/*
 * Variant inventory
 */
export const variantInventorySchema = z.object({
  id: z.number(),
  quantity: z.number(),
  variantId: z.number(),
});

/*
 * One selectable product variant
 */
export const productVariantSchema = z.object({
  id: z.number(),
  sku: z.string(),
  size: z.string(),
  productId: z.number(),

  inventory:
    variantInventorySchema.nullable(),
});

/*
 * Category information returned
 * by GET /products/:productId
 */
export const productDetailCategorySchema =
  z.object({
    id: z.number(),
    name: z.string(),
    parentId: z.number().nullable(),
  });

/*
 * Product list data + relations needed
 * by ProductDetailsPage
 */
export const productDetailSchema =
  productSchema.extend({
    category:
      productDetailCategorySchema,

    variants:
      z.array(productVariantSchema),
  });

export const productDetailResponseSchema =
  z.object({
    success: z.boolean(),
    data: productDetailSchema,
  });