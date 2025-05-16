import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(5, { message: "Name must be at least 5 characters" })
    .max(255, { message: "Name must be at most 255 characters" })
    .nonempty({ message: "Name is required" }),

  description: z.string().nonempty({ message: "Description is required" }),

  details: z.string().nonempty({ message: "Details are required" }),

  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .int({ message: "Price must be an integer" })
    .positive({ message: "Price must be a positive number" }),

  stock: z
    .number({ invalid_type_error: "Stock must be a number" })
    .positive({ message: "Stock must be a positive number" })
    .optional(),

  discount: z
    .number({ invalid_type_error: "Discount must be a number" })
    .positive({ message: "Discount must be a positive number" })
    .optional(),

  images: z
    .array(z.string().nonempty({ message: "Image URL cannot be empty" }))
    .nonempty({ message: "At least one image is required" }),

  tag: z
    .string()
    .max(50, { message: "Tag must be at most 50 characters" })
    .optional(),
});

export const updateProductSchema = z.object({
  id: z
    .string({ required_error: "ID is required" })
    .nonempty({ message: "ID must not be empty" }),

  name: z
    .string()
    .min(5, { message: "Name must be at least 5 characters" })
    .max(255, { message: "Name must be at most 255 characters" })
    .nonempty({ message: "Name is required" }),
  // Uniqueness to be handled in logic layer

  description: z.string().nonempty({ message: "Description is required" }),

  details: z.string().nonempty({ message: "Details are required" }),

  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .int({ message: "Price must be an integer" })
    .positive({ message: "Price must be a positive number" }),

  stock: z
    .number({ invalid_type_error: "Stock must be a number" })
    .positive({ message: "Stock must be a positive number" })
    .optional(),

  discount: z
    .number({ invalid_type_error: "Discount must be a number" })
    .positive({ message: "Discount must be a positive number" })
    .optional(),

  images: z
    .array(z.string().nonempty({ message: "Image URL cannot be empty" }))
    .nonempty({ message: "At least one image is required" }),

  tag: z
    .string()
    .max(50, { message: "Tag must be at most 50 characters" })
    .optional(),
});

export type UpdateProductDto = z.infer<typeof updateProductSchema>;
export type CreateProductDto = z.infer<typeof createProductSchema>;
