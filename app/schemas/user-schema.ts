import { z } from "zod";
import { userService } from "~/services/user-service.server";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .nonempty({ message: "Name is required" })
      .regex(/^[a-zA-Z]{3,}(?:\s[a-zA-Z]{3,})+$/, {
        message: "Enter full name (at least two words, each 3+ letters)",
      }),

    email: z
      .string()
      .trim()
      .nonempty({ message: "Email is required" })
      .email({ message: "Invalid email address" })
      .refine(
        async (value: string) => {
          const user = await userService.findByEmail(value);
          return user === undefined;
        },
        { message: "Email already exists" }
      ),

    password: z
      .string()
      .trim()
      .nonempty({ message: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters" }),

    confirmPassword: z
      .string()
      .trim()
      .nonempty({ message: "Confirm password is required" })
      .min(8, { message: "Confirm password must be at least 8 characters" }),

    // terms: z.literal("on", { message: "You must accept the Terms & Conditions" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty({ message: "Email is required" })
    .email({ message: "Invalid email address" }),

  password: z.string().trim().nonempty({ message: "Password is required" }),
});
