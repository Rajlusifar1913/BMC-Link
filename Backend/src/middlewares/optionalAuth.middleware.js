import prisma from "../config/prisma.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const optionalAuth = async (req, res, next) => {
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : req.cookies?.accessToken;
  if (!token) return next();
  try {
    const payload = verifyAccessToken(token);
    req.user =
      (await prisma.user.findFirst({
        where: { id: payload.userId, status: "ACTIVE", deletedAt: null },
      })) || undefined;
  } catch {
    /* Guest checkout remains available when an optional token is invalid. */
  }
  next();
};
