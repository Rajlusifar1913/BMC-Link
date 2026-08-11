import { z } from "zod";

import { ApiError } from "../utils/ApiError.js";

const setRequestValue = (req, key, value) => {
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

const isRequestSchemaMap = (value) =>
    value &&
    typeof value === "object" &&
    ("body" in value || "params" in value || "query" in value);

const validate = (schema, source) => {
    return async (req, res, next) => {
        try {
            if (isRequestSchemaMap(schema)) {
                const parsed = {};

                if (schema.body) {
                    parsed.body = await schema.body.parseAsync(req.body ?? {});
                    setRequestValue(req, "body", parsed.body);
                }

                if (schema.params) {
                    parsed.params = await schema.params.parseAsync(req.params ?? {});
                    setRequestValue(req, "params", parsed.params);
                }

                if (schema.query) {
                    parsed.query = await schema.query.parseAsync(req.query ?? {});
                    setRequestValue(req, "query", parsed.query);
                }

                req.validated = parsed;
                return next();
            }

            if (source && ["body", "params", "query"].includes(source)) {
                const parsed = await schema.parseAsync(req[source] ?? {});
                setRequestValue(req, source, parsed);
                req.validated = { [source]: parsed };
                return next();
            }

            const parsed = await schema.parseAsync({
                body: req.body ?? {},
                params: req.params ?? {},
                query: req.query ?? {},
            });

            if (parsed.body !== undefined) {
                setRequestValue(req, "body", parsed.body);
            }

            if (parsed.params !== undefined) {
                setRequestValue(req, "params", parsed.params);
            }

            if (parsed.query !== undefined) {
                setRequestValue(req, "query", parsed.query);
            }

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

export { validate };
export default validate;
