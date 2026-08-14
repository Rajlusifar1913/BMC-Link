import { Router } from "express";
import { createOrder, verifyCheckout, webhook } from "./payment.controller.js";

const router = Router();

router.post("/create-order", createOrder);
router.post("/verify-checkout", verifyCheckout);
router.post("/razorpay/webhook", webhook);

export default router;