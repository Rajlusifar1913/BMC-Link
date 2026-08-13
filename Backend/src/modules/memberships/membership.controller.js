import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import service from "./membership.service.js";
export const createPlan = asyncHandler(async (req, res) =>
  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        await service.createPlan(req.user.id, req.body),
        "Membership plan created",
      ),
    ),
);
export const updatePlan = asyncHandler(async (req, res) =>
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        await service.updatePlan(req.user.id, req.params.id, req.body),
        "Membership plan updated",
      ),
    ),
);
export const myPlans = asyncHandler(async (req, res) =>
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        await service.listMine(req.user.id),
        "Membership plans fetched",
      ),
    ),
);
export const publicPlans = asyncHandler(async (req, res) =>
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        await service.listPublic(req.params.username),
        "Membership plans fetched",
      ),
    ),
);
export const subscribe = asyncHandler(async (req, res) =>
  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        await service.subscribe(req.body, req.user?.id),
        "Membership order created",
      ),
    ),
);
export const verify = asyncHandler(async (req, res) =>
  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        await service.verify(req.body),
        "Membership verified",
      ),
    ),
);
export const myMemberships = asyncHandler(async (req, res) =>
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        await service.listMemberships(req.user.id),
        "Memberships fetched",
      ),
    ),
);
export const cancel = asyncHandler(async (req, res) =>
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        await service.cancel(req.user.id, req.params.id),
        "Membership cancelled",
      ),
    ),
);
