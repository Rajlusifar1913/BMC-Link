import { Router } from "express";
import { webhook } from "./payment.controller.js";
const router = Router();
router.post("/razorpay/webhook", webhook);
export default router;
