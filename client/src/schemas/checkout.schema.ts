import { z } from "zod";

export const checkoutInformationSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email address"),

  phone: z
    .string()
    .min(10, "Enter a valid phone number"),

  firstName: z
    .string()
    .min(2, "First name is required"),

  lastName: z
    .string()
    .min(2, "Last name is required"),

  country: z
    .string()
    .min(1, "Country is required"),

  state: z
    .string()
    .min(1, "State is required"),

  address: z
    .string()
    .min(5, "Address is required"),

  city: z
    .string()
    .min(2, "City is required"),

  postalCode: z
    .string()
    .min(4, "Postal code is required"),
});

export type CheckoutInformationInput =
  z.infer<typeof checkoutInformationSchema>;