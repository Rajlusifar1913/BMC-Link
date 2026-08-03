import { Router } from "express";

import validate from "../../middlewares/validate.middleware.js";

import {
    getProfile,
    updateProfile,
    getPublicProfile,
    checkUsername,
} from "./account.controller.js";

import { updateProfileSchema, usernameParamSchema } from "./account.validation.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const accountRouter = Router();

accountRouter.get(
    "/",
    verifyJWT,
    getProfile
);

accountRouter.patch(
    "/",
    verifyJWT,
    validate(updateProfileSchema),
    updateProfile
);

accountRouter.get(
    "/check-username/:username",
    validate(usernameParamSchema),
    checkUsername
);

accountRouter.get(
    "/:username",
    validate(usernameParamSchema),
    getPublicProfile
);

export default accountRouter;
