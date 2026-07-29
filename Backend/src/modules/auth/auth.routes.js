import { Router } from "express";
import passport from "passport";

import authController from "./auth.controller.js";
import validate from "../../middlewares/validate.middleware.js";
import { refreshTokenSchema } from "./auth.validation.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Google OAuth
|--------------------------------------------------------------------------
*/

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false,
    })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL}/login`,
    }),
    authController.googleSuccess
);

/*
|--------------------------------------------------------------------------
| Auth
|--------------------------------------------------------------------------
*/

router.post(
    "/refresh",
    validate(refreshTokenSchema),
    authController.refresh
);

router.get(
    "/refresh",
    authController.refresh
);

router.post(
    "/logout",
    authController.logout
);

router.get(
    "/logout",
    authController.logout
);

router.post(
    "/logout-all",
    authenticate,
    authController.logoutAll
);

router.get(
    "/logout-all",
    authenticate,
    authController.logoutAll
);

router.get(
    "/me",
    authenticate,
    authController.me
);

export default router;
