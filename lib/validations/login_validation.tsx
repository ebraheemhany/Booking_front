// lib/validations/login_validation.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Email format is incorrect"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .regex(/[A-Z]/, "It must contain a capital letter.")
    .regex(/[0-9]/, "It must contain a number."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
