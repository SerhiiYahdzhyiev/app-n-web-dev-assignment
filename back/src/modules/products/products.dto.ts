import { z } from "zod";

export const ProductSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  category: z.string().optional(),
  price: z.coerce.number().nonnegative().min(1),
  imageUrls: z.string().array().optional(),
}).strict();

export const ProductUpdatePayloadSchema = ProductSchema.partial();

export type TProductUpdatePayload = z.infer<typeof ProductUpdatePayloadSchema>;
