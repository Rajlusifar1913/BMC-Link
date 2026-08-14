import { z } from "zod";
const id = z.string().uuid();
const body = z.object({
  title: z.string().trim().min(1).max(150),
  description: z.string().trim().max(5000).optional().nullable(),
  price: z.coerce.number().nonnegative().max(1000000),
  categoryId: id.optional().nullable(),
  tagIds: z.array(id).max(20).optional(),
  thumbnail: z.string().url().optional().nullable(),
  previewUrl: z.string().url().optional().nullable(),
  visibility: z.enum(["PUBLIC", "PRIVATE", "UNLISTED"]).optional(),
  downloadLimit: z.coerce
    .number()
    .int()
    .positive()
    .max(1000)
    .optional()
    .nullable(),
});
export const createProductSchema = z.object({ body: body.strict() });
export const updateProductSchema = z.object({
  params: z.object({ id }),
  body: body.partial().strict(),
});
export const productIdSchema = z.object({ params: z.object({ id }) });
