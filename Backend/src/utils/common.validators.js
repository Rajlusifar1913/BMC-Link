import { z } from "zod";

export const uuid = z.string().uuid();

export const username = z
  .string()
  .min(3)
  .max(30)
  .regex(/^[a-zA-Z0-9_]+$/);

export const url = z.string().url();

export const email = z.string().email();

export const phone = z.string().min(8).max(20);
