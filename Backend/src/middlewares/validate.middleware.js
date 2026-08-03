import { z } from "zod";

import { ApiError } from "../utils/ApiError.js";

const validate = (schema) => {
    return async (req, res, next) => {
        try {
            const parsed = await schema.parseAsync({
                body: req.body ?? {},
                params: req.params ?? {},
                query: req.query ?? {},
            });

            req.body = parsed.body;
            req.params = parsed.params;

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
