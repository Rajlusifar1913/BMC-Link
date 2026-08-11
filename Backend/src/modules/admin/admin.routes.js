import { Router } from "express";
import { z } from "zod";
import validate from "../../middlewares/validate.middleware.js";
import {
	getUsersQuerySchema,
	updateUserParamsSchema,
	updateUserBodySchema,
	getCreatorsQuerySchema,
	getReportsQuerySchema
} from "./admin.validation.js";

import {
	verifyJWT,
	authorizeRoles
} from "../../middlewares/auth.middleware.js";

import { adminController } from "./admin.controller.js";

const router = Router();

router.use(
	verifyJWT,
	authorizeRoles("ADMIN")
);

router.get(
	"/users",
	validate(getUsersQuerySchema, "query"),
	adminController.getUsers
);

router.patch(
	"/users/:id",
	validate({
		params: updateUserParamsSchema,
		body: updateUserBodySchema,
		query: z.object({})
	}),
	adminController.updateUser
);

router.get(
	"/creators",
	validate(getCreatorsQuerySchema, "query"),
	adminController.getCreators
);

router.get(
	"/reports",
	validate(getReportsQuerySchema, "query"),
	adminController.getReports
);

export default router;
