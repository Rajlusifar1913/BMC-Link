import { Router } from "express";
import validate from "../../middlewares/validate.middleware.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { optionalAuth } from "../../middlewares/optionalAuth.middleware.js";
import * as controller from "./membership.controller.js";
import {
  createPlanSchema,
  updatePlanSchema,
  idSchema,
  subscribeSchema,
  verifySchema,
} from "./membership.validation.js";
const router = Router();
router.get("/public/:username", controller.publicPlans);
router.post(
  "/subscribe",
  optionalAuth,
  validate(subscribeSchema),
  controller.subscribe,
);
router.post("/verify", validate(verifySchema), controller.verify);
router.get("/me", verifyJWT, controller.myMemberships);
router.post("/:id/cancel", verifyJWT, validate(idSchema), controller.cancel);
router.get("/plans", verifyJWT, controller.myPlans);
router.post(
  "/plans",
  verifyJWT,
  validate(createPlanSchema),
  controller.createPlan,
);
router.patch(
  "/plans/:id",
  verifyJWT,
  validate(updatePlanSchema),
  controller.updatePlan,
);
export default router;
