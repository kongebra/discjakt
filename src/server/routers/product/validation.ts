import { z } from "zod";

export const getProductByIdSchema = z.number().min(1);

export const updateProductSchema = z.object({
  id: z.number().min(1),

  isDisc: z.boolean(),
  discId: z.number().min(1),
});
