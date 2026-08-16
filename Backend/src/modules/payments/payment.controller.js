import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import paymentService from "./payment.service.js";

export const webhook = asyncHandler(async (req, res) => {
  const result = await paymentService.receiveWebhook(
    req.body,
    req.headers["x-razorpay-signature"],
    req.headers["x-razorpay-event-id"],
  );
  res.status(200).json(new ApiResponse(200, result, "Webhook received"));
});

export const createOrder = asyncHandler(async (req, res) => {
  const { paymentType, amount, metadata } = req.body;
  const result = await paymentService.createOrder({
    userId: req.user?.id ?? null,
    paymentType,
    amount,
    metadata,
  });
  res.status(201).json(new ApiResponse(201, result, "Order created successfully"));
});

export const verifyCheckout = asyncHandler(async (req, res) => {
  const { orderId, paymentId, signature } = req.body;
  const result = await paymentService.verifyCheckout({
    orderId,
    paymentId,
    signature,
  });
  res.status(200).json(new ApiResponse(200, result, "Payment verified successfully"));
});
