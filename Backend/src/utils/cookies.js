const isProduction = process.env.NODE_ENV === "production";

const baseCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
};

export const accessCookieOptions = {
    ...baseCookieOptions,
    maxAge: 15 * 60 * 1000,
};

export const refreshCookieOptions = {
    ...baseCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
};