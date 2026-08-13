import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import productService from "./product.service.js";
export const create = asyncHandler(async (req, res) =>
  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        await productService.create(req.user.id, req.body),
        "Product created",
      ),
    ),
);
export const mine = asyncHandler(async (req, res) =>
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        await productService.mine(req.user.id),
        "Products fetched",
      ),
    ),
);
export const update = asyncHandler(async (req, res) =>
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        await productService.update(req.user.id, req.params.id, req.body),
        "Product updated",
      ),
    ),
);
export const publish = asyncHandler(async (req, res) =>
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        await productService.publish(req.user.id, req.params.id, true),
        "Product published",
      ),
    ),
);
export const unpublish = asyncHandler(async (req, res) =>
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        await productService.publish(req.user.id, req.params.id, false),
        "Product unpublished",
      ),
    ),
);
export const archive = asyncHandler(async (req, res) =>
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        await productService.archive(req.user.id, req.params.id),
        "Product archived",
      ),
    ),
);
export const uploadFile = asyncHandler(async (req, res) =>
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        await productService.uploadFile(req.user.id, req.params.id, req.file),
        "Product file uploaded",
      ),
    ),
);
export const uploadThumbnail = asyncHandler(async (req, res) =>
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        await productService.uploadThumbnail(
          req.user.id,
          req.params.id,
          req.file,
        ),
        "Product thumbnail uploaded",
      ),
    ),
);
export const publicList = asyncHandler(async (req, res) =>
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        await productService.publicList(req.params.username),
        "Public products fetched",
      ),
    ),
);
export const publicOne = asyncHandler(async (req, res) =>
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        await productService.publicOne(req.params.username, req.params.slug),
        "Product fetched",
      ),
    ),
);
