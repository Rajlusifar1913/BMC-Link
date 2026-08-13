import { Router } from "express";

import validate from "../../middlewares/validate.middleware.js";

import {
  getProfile,
  updateProfile,
  getPublicProfile,
  checkUsername,
  getSettings,
  updateSettings,
  getAnalytics,
} from "./account.controller.js";

import {
  updateProfileSchema,
  usernameParamSchema,
  updateSettingsSchema,
} from "./account.validation.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const accountRouter = Router();

accountRouter.get("/", verifyJWT, getProfile);

accountRouter.patch(
  "/",
  verifyJWT,
  validate(updateProfileSchema),
  updateProfile,
);

accountRouter.get(
  "/check-username/:username",
  validate(usernameParamSchema),
  checkUsername,
);

accountRouter.get("/settings", verifyJWT, getSettings);

accountRouter.patch(
  "/settings",
  verifyJWT,
  validate(updateSettingsSchema),
  updateSettings,
);

accountRouter.get("/analytics", verifyJWT, getAnalytics);

accountRouter.get(
  "/:username",
  validate(usernameParamSchema),
  getPublicProfile,
);

export default accountRouter;
