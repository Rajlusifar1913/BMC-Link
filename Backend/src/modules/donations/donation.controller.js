import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import donationService from "./donation.service.js";
export const createOrder = asyncHandler(async (req, res) =>
  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        await donationService.createOrder(req.body),
        "Donation order created",
      ),
    ),
);
export const verify = asyncHandler(async (req, res) =>
  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        await donationService.verify(req.body),
        "Donation verified",
      ),
    ),
);
export const listMine = asyncHandler(async (req, res) =>
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        await donationService.listForCreator(req.user.id),
        "Donations fetched",
      ),
    ),
);
