import { z } from "zod";

export const getBrandBySlugSchema = z.string();

export const deleteBrandSchema = z.number().min(1);

export const createBrandSchema = z.object({
  name: z.string(),
  description: z.string(),
  url: z.string(),
  imageUrl: z.string(),
  slug: z.string(),
});

export const updateBrandSchema = z.object({
  id: z.number().min(1),

  name: z.string(),
  description: z.string(),
  url: z.string(),
  imageUrl: z.string(),
  slug: z.string(),
});
