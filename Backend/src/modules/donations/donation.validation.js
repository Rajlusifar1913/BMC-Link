import { z } from "zod";

export const createDonationSchema = z.object({
  body: z
    .object({
      username: z.string().min(3).max(30),
      amount: z.coerce.number().positive().max(1000000),
      name: z.string().trim().max(100).optional(),
      email: z.string().email().optional(),
      message: z.string().trim().max(500).optional(),
      isAnonymous: z.boolean().optional(),
    })
    .strict(),
});
export const verifyDonationSchema = z.object({
  body: z
    .object({
      orderId: z.string().min(1),
      paymentId: z.string().min(1),
      signature: z.string().min(1),
    })
    .strict(),
});
