import { z } from "zod";

export const registerSchema = z.object({
  first_name: z
    .string()
    .min(3, "First name must be at least three characters long."),
  last_name: z
    .string()
    .min(3, "Last name must be at least three characters long."),
  email: z
    .string()
    .trim()
    .min(1, "Email is requird")
    .max(100, "Email must not exceed 100 characters.")
    .email("Email format is incorrect.")
    .refine(
      (email) => !/\s/.test(email),
      "Email address cannot contain spaces.",
    )
    .refine((email) => {
      const [local, domain] = email.split("@");
      return Boolean(local && domain);
    }, "Email address must contain @")
    .refine((email) => {
      const [, domain] = email.split("@");
      return domain && !domain.startsWith(".") && !domain.endsWith(".");
    }, "Invalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .regex(/[A-Z]/, "It must contain a capital letter.")
    .regex(/[0-9]/, "It must contain a number."),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
