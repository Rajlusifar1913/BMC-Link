import { z } from "zod";
import { url } from "../../utils/common.validators.js";

export const updateProfileSchema = z.object({
    body: z.object({
        name: z.string().min(2).max(100).optional(),
        phone: z
            .string()
            .regex(/^\+?[1-9]\d{7,14}$/, "Invalid phone number")
            .optional(),
        profilePicture: url.optional(),
        timezone: z.string().max(50).optional(),
        language: z.string().max(10).optional(),
        headline: z.string().max(120).optional(),
        bio: z.string().max(500).optional(),
        avatar: url.optional(),
        coverImage: url.optional(),
        website: url.optional(),
        accentColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color format").optional(),
        themeId: z.string().uuid().optional(),
    }).strict(),
    params: z.object({}),
    query: z.object({})
});

export const usernameParamSchema = z.object({
    body: z.object({}).optional(),
    params: z.object({
        username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    }),
    query: z.object({}).optional()
});