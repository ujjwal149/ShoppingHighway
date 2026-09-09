import { z } from "zod";

export const addCartItemSchema = z.object({
  variantId: z
    .number()
    .int()
    .positive(),

  quantity: z
    .number()
    .int()
    .positive()
    .max(99)
    .default(1),
});

export const cartItemParamsSchema = z.object({
  cartItemId: z.coerce
    .number()
    .int()
    .positive(),
});

export const updateCartItemSchema = z.object({
  quantity: z
    .number()
    .int()
    .positive()
    .max(99),
});

export type AddCartItemInput =
  z.infer<typeof addCartItemSchema>;

export type UpdateCartItemInput =
  z.infer<typeof updateCartItemSchema>;