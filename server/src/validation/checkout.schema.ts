import {
  z,
} from "zod";

export const prepareCheckoutSchema =
  z.object({
    addressId:
      z
        .number()
        .int()
        .positive(),
  });

export type PrepareCheckoutInput =
  z.infer<
    typeof prepareCheckoutSchema
  >;