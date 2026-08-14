import { z } from "zod";
import { url } from "../../utils/common.validators.js";

const optionalText = (schema) =>
  schema
    .trim()
    .min(1, "This field cannot be empty")
    .refine((value) => /[A-Za-z]/.test(value), {
      message: "This field must contain at least one letter",
    });

const optionalUpdateText = (schema) => schema.optional().nullable();

const ianaTimezoneRegex =
  /^(?:[A-Za-z]+\/[A-Za-z0-9._+-]+|UTC|GMT(?:[+-]\d{1,2})?)$/;

const languageTagRegex = /^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/;

export const updateProfileSchema = z.object({
  body: z
    .object({
      name: optionalUpdateText(optionalText(z.string().min(2).max(100))),
      phone: z
        .string()
        .trim()
        .regex(/^\+?[1-9]\d{7,14}$/, "Invalid phone number")
        .optional()
        .nullable(),
      profilePicture: url.optional().nullable(),
      timezone: optionalUpdateText(
        z
          .string()
          .trim()
          .max(50)
          .regex(ianaTimezoneRegex, "Invalid timezone format"),
      ),
      language: optionalUpdateText(
        z
          .string()
          .trim()
          .max(20)
          .regex(languageTagRegex, "Invalid language tag"),
      ),
      headline: optionalUpdateText(optionalText(z.string().trim().max(120))),
      bio: optionalUpdateText(
        z
          .string()
          .trim()
          .min(1, "This field cannot be empty")
          .max(500)
          .refine((value) => /[A-Za-z]/.test(value), {
            message: "Bio must contain at least one letter",
          }),
      ),
      avatar: url.optional().nullable(),
      coverImage: url.optional().nullable(),
      website: url.optional().nullable(),
      accentColor: z
        .string()
        .trim()
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color format")
        .optional()
        .nullable(),
      themeId: z.string().uuid().optional().nullable(),
    })
    .strict(),
  params: z.object({}),
  query: z.object({}),
});

export const usernameParamSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    username: z
      .string()
      .trim()
      .min(3)
      .max(30)
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ),
  }),
  query: z.object({}).optional(),
});

export const updateSettingsSchema = z.object({
  body: z
    .object({
      allowDonations: z.boolean().optional(),
      allowMemberships: z.boolean().optional(),
      allowProducts: z.boolean().optional(),
      showEmail: z.boolean().optional(),
    })
    .strict(),
  params: z.object({}),
  query: z.object({}),
});
