import { z } from "zod";
export const createPurchaseSchema = z.object({
  body: z
    .object({
      productId: z.string().uuid(),
      buyerName: z.string().trim().max(100).optional(),
      buyerEmail: z.string().email().optional(),
    })
    .strict(),
});
export const verifyPurchaseSchema = z.object({
  body: z
    .object({
      orderId: z.string().min(1),
      paymentId: z.string().min(1),
      signature: z.string().min(1),
    })
    .strict(),
});
export const purchaseIdSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});
