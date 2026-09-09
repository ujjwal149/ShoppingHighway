import type { Request, Response } from "express";
import { 
  getAllProducts,
  getProductById,
} from "../services/product.service";

import { 
  productQuerySchema 
} from "../validation/product.schema";

import {
  productParamsSchema,
} from "../validation/product.schema";


export const getProducts = async (
  req: Request,
  res: Response,
) => {
  try {
    const parsedQuery = productQuerySchema.safeParse(req.query);

    if (!parsedQuery.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: parsedQuery.error.flatten(),
      });
    }

    const result = await getAllProducts(parsedQuery.data);

    return res.status(200).json({
      success: true,
      data: result.products,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};


export const getProduct = async (
  req: Request,
  res: Response,
) => {
  try {
    const parsedParams =
      productParamsSchema.safeParse(
        req.params,
      );

    if (!parsedParams.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
        errors:
          parsedParams.error.flatten(),
      });
    }

    const { productId } =
      parsedParams.data;

    const product =
      await getProductById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(
      "Failed to fetch product:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};