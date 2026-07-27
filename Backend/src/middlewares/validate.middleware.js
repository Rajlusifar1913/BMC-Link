const validate = (schema) => {
    return async (req, res, next) => {
        try {
            const parsed = await schema.parseAsync({
                body: req.body,
                params: req.params,
                query: req.query,
            });

            req.body = parsed.body;
            req.params = parsed.params;
            req.query = parsed.query;

            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new ApiError(400, "Validation error", error.errors);
            }
            next(error);
        }
    };
};

export default validate;