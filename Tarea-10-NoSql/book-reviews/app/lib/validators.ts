import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8), // clave mínima
  name: z.string().min(2).max(50).optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const reviewCreateSchema = z.object({
  bookId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional()
});

export const voteSchema = z.object({
  reviewId: z.string().min(1),
  value: z.union([z.literal(1), z.literal(-1)])
});

export const favoriteSchema = z.object({
  bookId: z.string().min(1),
  note: z.string().max(200).optional()
});
