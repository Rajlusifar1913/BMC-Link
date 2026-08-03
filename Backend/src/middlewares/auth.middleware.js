import prisma from "../config/prisma.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {

    const bearerToken = req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null;

    const accessToken =
        req.cookies?.accessToken || bearerToken;

    if (!accessToken) {
        throw new ApiError(401, "Authentication required");
    }

    let payload;

    try {
        payload = verifyAccessToken(accessToken);
    } catch {
        throw new ApiError(401, "Invalid or expired access token");
    }

    const user = await prisma.user.findFirst({
        where: {
            id: payload.userId,
            deletedAt: null,
            status: "ACTIVE",
        },
    });

    if (!user) {
        throw new ApiError(401, "User not found");
    }

    req.user = user;
    req.sessionId = payload.sessionId;

    next();
});

export const authenticate = verifyJWT;
