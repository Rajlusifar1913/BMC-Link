import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import purchaseService from "./purchase.service.js";
export const createOrder = asyncHandler(async (req, res) =>
  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        await purchaseService.createOrder(req.body, req.user?.id),
        "Purchase order created",
      ),
    ),
);
export const verify = asyncHandler(async (req, res) =>
  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        await purchaseService.verify(req.body),
        "Purchase verified",
      ),
    ),
);
export const history = asyncHandler(async (req, res) =>
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        await purchaseService.history(req.user.id),
        "Purchase history fetched",
      ),
    ),
);
export const sales = asyncHandler(async (req, res) =>
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        await purchaseService.listForCreator(req.user.id),
        "Creator sales fetched",
      ),
    ),
);
export const download = asyncHandler(async (req, res) => {
  const item = await purchaseService.download(req.user.id, req.params.id);
  res.setHeader("Content-Disposition", `attachment; filename="${item.name}"`);
  res.type("application/octet-stream").send(item.file);
});
