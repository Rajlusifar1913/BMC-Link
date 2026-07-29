import express from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import accountRouter from "../modules/account/account.routes.js";
import linkRouter from "../modules/links/links.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";


const router = express.Router();

router.route("/health").get((req, res) => {
    return res.status(200).json(
        new ApiResponse(200, {message: "BMC-Link Backend API is running."})
    );
});

router.use("/auth", authRoutes);
router.use("/account", accountRouter);
router.use("/links", linkRouter);

export default router;
