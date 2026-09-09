import type { Request, Response } from "express";
import { getAllCategories } from "../services/category.service";

export const getCategories = async (
  req: Request,
  res: Response,
) => {
  try {
    const categories =
      await getAllCategories();

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(
      "Failed to fetch categories:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};