import { z } from "zod";

export const ProductSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  price: z.coerce.number().nonnegative().min(1),
  imageUrls: z.string().array().optional(),
});

export const ProductUpdatePayloadSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().nonnegative().min(1).optional(),
  imageUrls: z.string().array().optional(),
});

export type TProductUpdatePayload = z.infer<typeof ProductUpdatePayloadSchema>;
