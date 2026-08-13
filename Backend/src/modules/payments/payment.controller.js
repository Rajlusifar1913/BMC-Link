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
