// payment.validation.js
import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    userId: z.string().uuid().optional().nullable(),
    paymentType: z.enum(["DONATION", "MEMBERSHIP", "PREMIUM_SUBSCRIPTION", "PRODUCT_PURCHASE"]),
    amount: z.coerce.number().positive().max(1000000),
    metadata: z.record(z.any()).optional(),
  }).strict(),
});

export const verifyCheckoutSchema = z.object({
  body: z.object({
    orderId: z.string().min(1),
    paymentId: z.string().min(1),
    signature: z.string().min(1),
  }).strict(),
});

export const webhookSchema = z.object({
  body: z.record(z.any()),
  headers: z.object({
    "x-razorpay-signature": z.string().min(1),
    "x-razorpay-event-id": z.string().optional(),
  }),
});