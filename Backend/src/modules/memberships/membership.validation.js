import { z } from "zod";
const id = z.string().uuid();
const plan = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().max(2000).optional().nullable(),
  price: z.coerce.number().positive().max(1000000),
  durationDays: z.coerce.number().int().positive().max(3650),
  isActive: z.boolean().optional(),
});
export const createPlanSchema = z.object({ body: plan.strict() });
export const updatePlanSchema = z.object({
  params: z.object({ id }),
  body: plan.partial().strict(),
});
export const idSchema = z.object({ params: z.object({ id }) });
export const subscribeSchema = z.object({
  body: z
    .object({
      planId: id,
      memberName: z.string().trim().max(100).optional(),
      memberEmail: z.string().email().optional(),
    })
    .strict(),
});
export const verifySchema = z.object({
  body: z
    .object({
      orderId: z.string().min(1),
      paymentId: z.string().min(1),
      signature: z.string().min(1),
    })
    .strict(),
});
