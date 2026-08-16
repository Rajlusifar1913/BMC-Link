import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import {
	createOrderSchema,
	verifyCheckoutSchema,
	webhookSchema,
} from "./payment.validation.js";
import { createOrder, verifyCheckout, webhook } from "./payment.controller.js";

const router = Router();

router.post(
	"/create-order",
	authenticate,
	validate(createOrderSchema),
	createOrder,
);
router.post(
	"/verify-checkout",
	authenticate,
	validate(verifyCheckoutSchema),
	verifyCheckout,
);
router.post("/razorpay/webhook", validate(webhookSchema), webhook);

export default router;