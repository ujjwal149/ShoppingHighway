import { z } from "zod";

export const addressLabelSchema =
  z.enum([
    "HOME",
    "OFFICE",
    "OTHER",
  ]);

const addressFields = {
  label:
    addressLabelSchema,

  customLabel:
    z
      .string()
      .trim()
      .min(2)
      .max(40)
      .optional()
      .nullable(),

  fullName:
    z
      .string()
      .trim()
      .min(2)
      .max(80),

  phone:
    z
      .string()
      .trim()
      .min(7)
      .max(20),

  addressLine1:
    z
      .string()
      .trim()
      .min(3)
      .max(120),

  addressLine2:
    z
      .string()
      .trim()
      .max(120)
      .optional()
      .nullable(),

  city:
    z
      .string()
      .trim()
      .min(2)
      .max(60),

  state:
    z
      .string()
      .trim()
      .min(2)
      .max(60),

  postalCode:
    z
      .string()
      .trim()
      .min(3)
      .max(12),

  country:
    z
      .string()
      .trim()
      .min(2)
      .max(60),

  isDefault:
    z
      .boolean()
      .optional()
      .default(false),
};

export const createAddressSchema =
  z
    .object(
      addressFields,
    )
    .superRefine(
      (data, ctx) => {
        if (
          data.label ===
            "OTHER" &&
          !data.customLabel
        ) {
          ctx.addIssue({
            code: "custom",
            path: [
              "customLabel",
            ],
            message:
              "Custom label is required when label is OTHER",
          });
        }
      },
    );

export const updateAddressSchema =
  z.object(
    addressFields,
  ).partial();

export const addressParamsSchema =
  z.object({
    addressId:
      z.coerce
        .number()
        .int()
        .positive(),
  });

export type CreateAddressInput =
  z.infer<
    typeof createAddressSchema
  >;

export type UpdateAddressInput =
  z.infer<
    typeof updateAddressSchema
  >;