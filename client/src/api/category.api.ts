import { api } from "./axios";

import {
  categoryResponseSchema,
} from "../schemas/category.schema";

export const getCategories = async () => {
  const response =
    await api.get("/categories");

  return categoryResponseSchema.parse(
    response.data,
  );
};