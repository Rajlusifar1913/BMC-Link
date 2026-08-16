import { Router } from "express";
import passport from "passport";

import authController from "./auth.controller.js";
import validate from "../../middlewares/validate.middleware.js";
import { refreshTokenSchema } from "./auth.validation.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const authRoutes = Router();

authRoutes.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

authRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  }),
  authController.googleSuccess,
);

authRoutes.post(
  "/refresh",
  validate(refreshTokenSchema),
  authController.refresh,
);

authRoutes.post("/logout", authenticate, authController.logout);

authRoutes.post("/logout-all", authenticate, authController.logoutAll);

authRoutes.get("/me", authenticate, authController.me);

export default authRoutes;
