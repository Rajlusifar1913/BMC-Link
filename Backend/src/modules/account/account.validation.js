import { z } from "zod";
import { url } from "../../utils/common.validators.js";

export const updateProfileSchema = z.object({

    body: z.object({

        name: z.string().min(2).max(100).optional(),

        phone: z.string().max(20).optional(),

        profilePicture: url.optional(),

        timezone: z.string().optional(),

        language: z.string().optional(),

        headline: z.string().max(120).optional(),

        bio: z.string().max(500).optional(),

        avatar: url.optional(),

        coverImage: url.optional(),

        website: url.optional(),

        accentColor: z.string().optional(),

        themeId: z.string().uuid().optional(),

    }),

    params: z.object({}),

    query: z.object({})

});