import { Router } from "express";
import validate from "../../middlewares/validate.middleware.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { optionalAuth } from "../../middlewares/optionalAuth.middleware.js";
import * as controller from "./purchase.controller.js";
import {
  createPurchaseSchema,
  verifyPurchaseSchema,
  purchaseIdSchema,
} from "./purchase.validation.js";
const router = Router();
router.post(
  "/orders",
  optionalAuth,
  validate(createPurchaseSchema),
  controller.createOrder,
);
router.post("/verify", validate(verifyPurchaseSchema), controller.verify);
router.get("/sales", verifyJWT, controller.sales);
router.get("/", verifyJWT, controller.history);
router.get(
  "/:id/download",
  verifyJWT,
  validate(purchaseIdSchema),
  controller.download,
);
export default router;
