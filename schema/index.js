import { z } from "zod";

const productSchema = z.object({
  title: z.string().min(1, "title must be greater than 1 character"),
  price: z.number().min(1, "price must be greater than or equal to 1"),
  description: z
    .string()
    .min(1, "description must be greater than 1 character"),
  categoryId: z.string().min(1, "categoryId must be greater than 1 character"),
});

const categorySchema = z.object({
  title: z.string().min(1, "title must be greater than 1 character"),
  description: z
    .string()
    .min(1, "description must be greater than 1 character"),
  slug: z.string().min(1, "slug must be greater than 1 character"),
});

const registerSchema = z.object({
  username: z.string().min(1, "username must be greater than 1 character"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "password must be greater than 1 character"),
  role: z.enum(["user", "admin", "ceo"]),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "password must be greater than 1 character"),
});

export { productSchema, categorySchema, registerSchema, loginSchema };
