import crypto from "crypto"

export const hashRefreshToken = (refreshToken) => {
    return crypto
        .createHmac(
            "sha256",
            process.env.REFRESH_TOKEN_HASH_SECRET
        )
        .update(refreshToken)
        .digest("hex");
};