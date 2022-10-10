import { z } from "zod";

export const getDiscBySlugSchema = z.string();

export const createDiscSchema = z.object({
  name: z.string(),
  description: z.string(),
  url: z.string(),
  imageUrl: z.string(),
  slug: z.string(),

  speed: z.number(),
  glide: z.number(),
  turn: z.number(),
  fade: z.number(),

  brandId: z.number(),

  type: z.enum(["putter", "midrage", "fairway", "distance"]),
});

export const updateDiscSchema = z.object({
  id: z.number().min(1),

  name: z.string(),
  description: z.string(),
  url: z.string(),
  imageUrl: z.string(),
  slug: z.string(),

  speed: z.number(),
  glide: z.number(),
  turn: z.number(),
  fade: z.number(),

  brandId: z.number(),

  type: z.enum(["putter", "midrage", "fairway", "distance"]),
});

export const deleteDiscSchema = z.number().min(1);

export const searchDiscSchema = z.string().nullish();
