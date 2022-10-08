import { z } from "zod";

export const getStoreBySlugSchema = z.string();

export const createStoreSchema = z.object({
  name: z.string(),
  baseUrl: z.string(),
  sitemapUrl: z.string(),
  slug: z.string(),
});
