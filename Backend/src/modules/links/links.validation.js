import { z } from "zod";
import { uuid, url } from "../../utils/common.validators.js";

const optionalNullableString = (schema) =>
    z.preprocess(
        (value) => (value === "" ? null : value),
        schema.nullable().optional()
    );

const linkType = z.enum([
    "WEBSITE",
    "YOUTUBE",
    "INSTAGRAM",
    "FACEBOOK",
    "TWITTER",
    "GITHUB",
    "CUSTOM",
]);

export const createLinkSchema = z.object({
    body: z.object({
        title: optionalNullableString(
            z.string().trim().min(1, "Title cannot be empty").max(100)
        ),

        url,
        type: linkType,
        icon: optionalNullableString(
            z.string().trim().min(1).max(255)
        ),

        thumbnail: optionalNullableString(url),
        position: z.number()
            .int()
            .min(1)
            .optional(),

        isFeatured: z.boolean().optional(),
        isActive: z.boolean().optional(),
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),
    }).refine(
        (data) =>
            !data.startDate ||
            !data.endDate ||
            data.endDate >= data.startDate,
        {
            message: "endDate must be after startDate",
            path: ["endDate"],
        }
    ).strict(),

    params: z.object({}),
    query: z.object({}),
});

export const updateLinkSchema = z.object({
    body: z.object({
        title: optionalNullableString(
            z.string().trim().min(1, "Title cannot be empty").max(100)
        ),

        url: url.optional(),
        type: linkType.optional(),
        icon: optionalNullableString(
            z.string().trim().min(1).max(255)
        ),

        thumbnail: optionalNullableString(url),
        position: z.number()
            .int()
            .min(1)
            .optional(),

        isFeatured: z.boolean().optional(),
        isActive: z.boolean().optional(),
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),
    }).refine(
        (data) =>
            !data.startDate ||
            !data.endDate ||
            data.endDate >= data.startDate,
        {
            message: "endDate must be after startDate",
            path: ["endDate"],
        }
    ).strict(),

    params: z.object({
        id: uuid,
    }),

    query: z.object({}),
});

export const linkIdParamSchema = z.object({
    body: z.object({}).optional(),

    params: z.object({
        id: uuid,
    }),

    query: z.object({}).optional(),
});

export const reorderLinksSchema = z.object({
    body: z.object({
        links: z.array(
            z.object({
                id: uuid,
                position: z.number().int().min(1)
            })
        ).min(1),
    }).strict(),

    params: z.object({}),

    query: z.object({}),
});

export const getLinksQuerySchema = z.object({
    body: z.object({}).optional(),

    params: z.object({}).optional(),

    query: z.object({
        page: z.coerce.number().int().min(1).optional(),

        limit: z.coerce.number().int().min(1).max(100).optional(),

        search: z
            .string()
            .trim()
            .min(1)
            .max(100)
            .optional(),

        isActive: z
            .enum(["true", "false"])
            .optional(),

        type: linkType.optional(),

        sortBy: z
            .enum([
                "title",
                "createdAt",
                "updatedAt",
                "position",
                "clickCount",
            ])
            .optional(),

        order: z
            .enum(["asc", "desc"])
            .optional(),
    }).strict(),
});