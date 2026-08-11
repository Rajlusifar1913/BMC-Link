import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

import { adminService } from "./admin.service.js";

class AdminController {

	getUsers = asyncHandler(async (req, res) => {

		const result =
			await adminService.getUsers(
				req.validated?.query || req.query
			);

		return res.status(200).json(

			new ApiResponse(

				200,

				result,

				"Users fetched successfully"

			)

		);

	});

	updateUser = asyncHandler(async (req, res) => {

		const user =
			await adminService.updateUser(
				req.params.id,
				req.body
			);

		return res.status(200).json(

			new ApiResponse(
				200,
				user,
				"User updated successfully"
			)

		);
	});

	getCreators = asyncHandler(async (req, res) => {

		const result =
			await adminService.getCreators(
				req.validated?.query || req.query
			);

		return res.status(200).json(
			new ApiResponse(
				200,
				result,
				"Creators fetched successfully"
			)
		);
	});

	getReports = asyncHandler(async (req, res) => {

		const result =
			await adminService.getReports(
				req.validated?.query || req.query
			);

		return res.status(200).json(
			new ApiResponse(
				200,
				result,
				"Reports fetched successfully"
			)
		);

	});

}

export const adminController =
	new AdminController();