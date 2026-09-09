import { z } from "zod";

export const productQuerySchema = z.object({

  search: z
  .string()
  .trim()
  .min(1)
  .max(100)
  .optional(),
  
  categoryId: z.coerce
    .number()
    .int()
    .positive()
    .optional(),

  minPrice: z.coerce
    .number()
    .int()
    .nonnegative()
    .optional(),

  maxPrice: z.coerce
    .number()
    .int()
    .nonnegative()
    .optional(),

  rating: z.coerce
    .number()
    .min(0)
    .max(5)
    .optional(),

  page: z.coerce
    .number()
    .int()
    .positive()
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(50)
    .default(10),
})
 .refine(
    (data) => 
        data.minPrice === undefined || 
        data.maxPrice === undefined ||      
        data.minPrice <= data.maxPrice,
    {
      message: "minPrice cannot be greater than maxPrice",
      path: ["minPrice"],
    }, 
 )

 export const productParamsSchema = z.object({
  productId: z.coerce
    .number()
    .int()
    .positive(),
});

export type ProductParams =
  z.infer<typeof productParamsSchema>;

export type ProductQueryInput =
  z.infer<typeof productQuerySchema>;