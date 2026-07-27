import {asyncHandler} from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import accountService from "./account.service.js";
import { ApiError } from "../../utils/ApiError.js";

export const getProfile = asyncHandler(async (req, res) => {
    if (!req.user?.id) {
        throw new ApiError(401, "Unauthorized access");
    }

    const profile = await accountService.getProfile(req.user.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            profile,
            "Profile fetched successfully"
        )
    );
});

export const updateProfile = asyncHandler(async (req, res) => {
    if (!req.user?.id) {
        throw new ApiError(401, "Unauthorized access");
    }

    const profile = await accountService.updateProfile(
        req.user.id,
        req.body
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            profile,
            "Profile updated successfully"
        )
    );
});

export const getPublicProfile = asyncHandler(async (req, res) => {

    const profile = await accountService.getPublicProfile(
        req.params.username
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            profile,
            "Public profile fetched successfully"
        )
    );
});

export const checkUsername = asyncHandler(async (req, res) => {

    const result = await accountService.checkUsername(
        req.params.username
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            result
        )
    );
});