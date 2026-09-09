import { z } from "zod";

export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  parentId: z.number().nullable(),
});

export const categoryResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(categorySchema),
});