import { z } from "zod";

import {
  productSchema,
  productResponseSchema,
  productVariantSchema,
  productDetailSchema,
  productDetailResponseSchema,
} from "../schemas/product.schema";

export type Product =
  z.infer<typeof productSchema>;

export type ProductResponse =
  z.infer<typeof productResponseSchema>;

export type ProductVariant =
  z.infer<typeof productVariantSchema>;

export type ProductDetail =
  z.infer<typeof productDetailSchema>;

export type ProductDetailResponse =
  z.infer<
    typeof productDetailResponseSchema
  >;