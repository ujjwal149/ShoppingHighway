import { db } from "../prisma/db";

import type {
  ProductQueryInput,
} from "../validation/product.schema";

import {
  getCategoryAndDescendantIds,
} from "./category.service";

export const getAllProducts = async (
  filters: ProductQueryInput,
) => {
  const {
    search,
    categoryId,
    minPrice,
    maxPrice,
    rating,
    page,
    limit,
  } = filters;

  let query = db.orm.public.Product;

  // Category + descendant category filter

  if (categoryId !== undefined) {
    const categoryIds =
      await getCategoryAndDescendantIds(categoryId);

    if (categoryIds.length === 0) {
      return {
        products: [],
        pagination: {
          page,
          limit,
          hasNextPage: false,
        },
      };
    }

    query = query.where((product) =>
      product.categoryId.in(categoryIds),
    );
  }

  // Search filter
  if (search !== undefined) {
  query = query.where((product) =>
    product.name.ilike(`%${search}%`),
  );
}

  // Minimum price
  if (minPrice !== undefined) {
    query = query.where((product) =>
      product.price.gte(minPrice),
    );
  }

  // Maximum price
  if (maxPrice !== undefined) {
    query = query.where((product) =>
      product.price.lte(maxPrice),
    );
  }

  // Minimum rating
  if (rating !== undefined) {
    query = query.where((product) =>
      product.rating.gte(rating),
    );
  }

  const offset = (page - 1) * limit;

  const rows = await query
    .orderBy((product) =>
      product.createdAt.desc(),
    )
    .offset(offset)
    .limit(limit + 1)
    .all();

  const hasNextPage =
    rows.length > limit;

  const products =
    rows.slice(0, limit);

  return {
    products,

    pagination: {
      page,
      limit,
      hasNextPage,
    },
  };
};

export const getProductById = async (
  productId: number,
) => {
  const product =
    await db.orm.public.Product
      .where({
        id: productId,
      })
      .include("category")
      .include(
        "variants",
        (variants) =>
          variants.include("inventory"),
      )
      .first();

  return product;
};