import { ApiError } from "../utils/ApiError.js";
import { csrfCookieOptions } from "../utils/cookies.js";
import { generateCsrfToken, timingSafeEqualHex } from "../utils/security.js";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const EXEMPT_PATHS = [
	/^\/api-docs(?:\/.*)?$/,
	/^\/api-docs\.json$/,
	/^\/api\/v1\/payments\/razorpay\/webhook$/,
	/^\/api\/v1\/auth\/google(?:\/.*)?$/,
	/^\/api\/v1\/auth\/google\/callback$/,
];

export const setCsrfCookie = (req, res, next) => {
	const existingToken = req.cookies?.csrfToken;
	const token = existingToken || generateCsrfToken();

	if (!existingToken) {
		res.cookie("csrfToken", token, csrfCookieOptions);
	}

	req.csrfToken = token;
	next();
};

export const csrfProtection = (req, res, next) => {
	if (SAFE_METHODS.has(req.method)) {
		return next();
	}

	const isExemptPath = EXEMPT_PATHS.some((pattern) => pattern.test(req.path));
	if (isExemptPath) {
		return next();
	}

	if (process.env.NODE_ENV !== "production") {
		return next();
	}

	const submittedToken =
		req.get("x-csrf-token") ||
		req.get("X-CSRF-Token") ||
		req.body?.csrfToken ||
		req.headers["x-csrf-token"];

	if (!submittedToken || !timingSafeEqualHex(req.csrfToken || "", submittedToken)) {
		return next(new ApiError(403, "CSRF token missing or invalid"));
	}

	next();
};
