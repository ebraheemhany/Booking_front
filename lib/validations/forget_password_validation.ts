import { z } from "zod";

export const forgetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
});

export type ForgetPasswordFormValues = z.infer<typeof forgetPasswordSchema>;