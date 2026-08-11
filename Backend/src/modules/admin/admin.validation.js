import { z } from "zod";

export const getUsersQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(10),

    search: z.string().trim().optional(),

    role: z.enum(["ADMIN", "CREATOR"]).optional(),

    status: z.enum(["ACTIVE", "SUSPENDED", "DELETED"]).optional(),

    sortBy: z
        .enum([
            "createdAt",
            "name",
            "email",
            "lastLogin"
        ])
        .default("createdAt"),

    order: z
        .enum(["asc", "desc"])
        .default("desc")
});

export const updateUserParamsSchema = z.object({
    id: z.uuid()
});

export const updateUserBodySchema = z.object({
    role: z.enum(["ADMIN", "CREATOR"]).optional(),

    status: z
        .enum([
            "ACTIVE",
            "SUSPENDED",
            "DELETED"
        ])
        .optional(),

    name: z.string().trim().min(1).optional()
}).refine(
    (data) => data.role || data.status || data.name,
    {
        message: "At least one field is required."
    }
);

export const getCreatorsQuerySchema = z.object({
    page: z.coerce.number()
        .int()
        .min(1)
        .default(1),

    limit: z.coerce.number()
        .int()
        .min(1)
        .max(100)
        .default(10),

    search: z.string()
        .trim()
        .optional(),

    status: z.enum([
        "ACTIVE",
        "SUSPENDED",
        "DELETED"
    ]).optional(),

    sortBy: z.enum([
        "createdAt",
        "username"
    ]).default("createdAt"),

    order: z.enum([
        "asc",
        "desc"
    ]).default("desc")
});

export const getReportsQuerySchema = z.object({
    page: z.coerce.number()
        .int()
        .min(1)
        .default(1),

    limit: z.coerce.number()
        .int()
        .min(1)
        .max(100)
        .default(20),

    search: z.string()
        .trim()
        .optional(),

    action: z.string()
        .trim()
        .optional(),

    entity: z.string()
        .trim()
        .optional(),

    userId: z.uuid()
        .optional(),

    startDate: z.coerce.date()
        .optional(),

    endDate: z.coerce.date()
        .optional(),

    sortBy: z.enum([
        "createdAt",
        "action",
        "entity"
    ]).default("createdAt"),

    order: z.enum([
        "asc",
        "desc"
    ]).default("desc")
});