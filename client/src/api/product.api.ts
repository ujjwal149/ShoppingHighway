import { api } from "./axios";

import {
  productResponseSchema,
  productDetailResponseSchema,
} from "../schemas/product.schema";

import type {
  ProductResponse,
  ProductDetailResponse,
} from "../types/product";

export interface ProductQueryParams {
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  page?: number;
  limit?: number;
}

export const getProducts = async (
  params: ProductQueryParams = {},
): Promise<ProductResponse> => {
  const response = await api.get(
    "/products",
    {
      params,
    },
  );

  return productResponseSchema.parse(
    response.data,
  );
};

export const getProductById = async (
  productId: number,
): Promise<ProductDetailResponse> => {
  const response = await api.get(
    `/products/${productId}`,
  );

  return productDetailResponseSchema.parse(
    response.data,
  );
};