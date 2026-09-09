import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long"),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .transform((email) =>
      email.toLowerCase(),
    ),

  password: z
    .string()
    .min(
      8,
      "Password must be at least 8 characters",
    )
    .max(
      72,
      "Password is too long",
    ),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .transform((email) =>
      email.toLowerCase(),
    ),

  password: z
    .string()
    .min(1, "Password is required"),
});

export type LoginInput =
  z.infer<typeof loginSchema>;

export type SignupInput =
  z.infer<typeof signupSchema>;