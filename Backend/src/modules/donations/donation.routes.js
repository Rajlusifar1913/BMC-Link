import { Router } from "express";
import validate from "../../middlewares/validate.middleware.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { createOrder, verify, listMine } from "./donation.controller.js";
import {
  createDonationSchema,
  verifyDonationSchema,
} from "./donation.validation.js";
const router = Router();
router.post("/orders", validate(createDonationSchema), createOrder);
router.post("/verify", validate(verifyDonationSchema), verify);
router.get("/received", verifyJWT, listMine);
export default router;
