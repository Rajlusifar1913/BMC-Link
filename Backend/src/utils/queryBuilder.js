export function buildSearch(search, fields = []) {
    if (!search) return undefined;

    return {
        OR: fields.map((field) => ({
            [field]: {
                contains: search,
                mode: "insensitive",
            },
        })),
    };
}