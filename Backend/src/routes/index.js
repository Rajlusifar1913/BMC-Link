import express from "express";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = express.Router();

router.route("/health").get((req, res) => {
    return res.status(200).json(
        new ApiResponse(200, {}, "BMC-Link Backend API is running.")
    );
});

export default router;