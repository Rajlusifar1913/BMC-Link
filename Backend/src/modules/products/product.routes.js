import { Router } from "express";
import validate from "../../middlewares/validate.middleware.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { upload } from "../media/storage.service.js";
import * as controller from "./product.controller.js";
import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
} from "./product.validation.js";
const router = Router();
router.get("/public/:username", controller.publicList);
router.get("/public/:username/:slug", controller.publicOne);
router.get("/", verifyJWT, controller.mine);
router.post("/", verifyJWT, validate(createProductSchema), controller.create);
router.patch(
  "/:id",
  verifyJWT,
  validate(updateProductSchema),
  controller.update,
);
router.post(
  "/:id/file",
  verifyJWT,
  validate(productIdSchema),
  upload.single("file"),
  controller.uploadFile,
);
router.post(
  "/:id/thumbnail",
  verifyJWT,
  validate(productIdSchema),
  upload.single("thumbnail"),
  controller.uploadThumbnail,
);
router.post(
  "/:id/publish",
  verifyJWT,
  validate(productIdSchema),
  controller.publish,
);
router.post(
  "/:id/unpublish",
  verifyJWT,
  validate(productIdSchema),
  controller.unpublish,
);
router.delete("/:id", verifyJWT, validate(productIdSchema), controller.archive);
export default router;
