import { z } from "zod";

import { ApiError } from "../utils/ApiError.js";

const setRequestValue = (req, key, value) => {
    if (key === "params" || key === "query") {
        return;
    }

    try {
        req[key] = value;
    } catch {
        Object.defineProperty(req, key, {
            configurable: true,
            enumerable: true,
            writable: true,
            value,
        });
    }
};

const validate = (schema) => {
    return async (req, res, next) => {
        try {
            const parsed = await schema.parseAsync({
                body: req.body ?? {},
                params: req.params ?? {},
                query: req.query ?? {},
            });

            setRequestValue(req, "body", parsed.body);
            req.validated = parsed;

            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const firstError = error.issues?.[0];
                const message =
                    firstError?.message || "Invalid request data";
                return next(new ApiError(400, message));
            }
            next(error);
        }
    };
};

export default validate;
