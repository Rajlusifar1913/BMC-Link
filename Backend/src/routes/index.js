import express from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import accountRouter from "../modules/account/account.routes.js";
import linkRouter from "../modules/links/links.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import adminRoutes from "../modules/admin/admin.routes.js";
import donationRoutes from "../modules/donations/donation.routes.js";
import productRoutes from "../modules/products/product.routes.js";
import purchaseRoutes from "../modules/purchases/purchase.routes.js";
import membershipRoutes from "../modules/memberships/membership.routes.js";

const router = express.Router();

router.route("/health").get((req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(200, { message: "BMC-Link Backend API is running." }),
    );
});

router.use("/auth", authRoutes);
router.use("/account", accountRouter);
router.use("/links", linkRouter);
router.use("/admin", adminRoutes);
router.use("/donations", donationRoutes);
router.use("/products", productRoutes);
router.use("/purchases", purchaseRoutes);
router.use("/memberships", membershipRoutes);

export default router;
