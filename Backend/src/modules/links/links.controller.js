import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

import linkService from "./links.service.js";

export const createLink = asyncHandler(async (req, res) => {
  if (!req.user?.id) {
    throw new ApiError(401, "Unauthorized access");
  }

  const link = await linkService.createLink(req.user.id, req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, link, "Link created successfully"));
});

export const getCreatorLinks = asyncHandler(async (req, res) => {
  if (!req.user?.id) {
    throw new ApiError(401, "Unauthorized access");
  }

  const links = await linkService.getCreatorLinks(req.user.id, req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, links, "Links fetched successfully"));
});

export const getLink = asyncHandler(async (req, res) => {
  if (!req.user?.id) {
    throw new ApiError(401, "Unauthorized access");
  }

  const link = await linkService.getLink(req.user.id, req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, link, "Link fetched successfully"));
});

export const updateLink = asyncHandler(async (req, res) => {
  if (!req.user?.id) {
    throw new ApiError(401, "Unauthorized access");
  }

  const link = await linkService.updateLink(
    req.user.id,
    req.params.id,
    req.body,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, link, "Link updated successfully"));
});

export const deleteLink = asyncHandler(async (req, res) => {
  if (!req.user?.id) {
    throw new ApiError(401, "Unauthorized access");
  }

  await linkService.deleteLink(req.user.id, req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Link deleted successfully"));
});

export const toggleLink = asyncHandler(async (req, res) => {
  if (!req.user?.id) {
    throw new ApiError(401, "Unauthorized access");
  }

  const link = await linkService.toggleLink(req.user.id, req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, link, "Link status updated successfully"));
});

export const duplicateLink = asyncHandler(async (req, res) => {
  if (!req.user?.id) {
    throw new ApiError(401, "Unauthorized access");
  }

  const link = await linkService.duplicateLink(req.user.id, req.params.id);

  return res
    .status(201)
    .json(new ApiResponse(201, link, "Link duplicated successfully"));
});

export const reorderLinks = asyncHandler(async (req, res) => {
  if (!req.user?.id) {
    throw new ApiError(401, "Unauthorized access");
  }

  await linkService.reorderLinks(req.user.id, req.body.links);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Links reordered successfully"));
});

export const getPublicLinks = asyncHandler(async (req, res) => {
  const links = await linkService.getPublicLinks(req.params.username);

  return res
    .status(200)
    .json(new ApiResponse(200, links, "Public links fetched successfully"));
});
