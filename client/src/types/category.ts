import { z } from "zod";

import {
  categorySchema,
} from "../schemas/category.schema";

export type Category =
  z.infer<typeof categorySchema>;