import crypto from "node:crypto";

export const normalizeAllowedOrigins = (value = "") => {
	if (Array.isArray(value)) {
		return value
			.map((origin) => String(origin).trim())
			.filter(Boolean);
	}

	return String(value)
		.split(",")
		.map((origin) => origin.trim())
		.filter(Boolean);
};

export const generateCsrfToken = () =>
	crypto.randomBytes(32).toString("hex");

export const timingSafeEqualHex = (expected, actual) => {
	if (typeof expected !== "string" || typeof actual !== "string") {
		return false;
	}

	if (expected.length !== actual.length) {
		return false;
	}

	try {
		return crypto.timingSafeEqual(
			Buffer.from(expected, "hex"),
			Buffer.from(actual, "hex"),
		);
	} catch {
		return false;
	}
};

export const getServerBaseUrl = (env = process.env) => {
	const rawUrl = env.SERVER_URL || env.APP_URL || `http://localhost:${env.PORT || 4800}`;
	return String(rawUrl).replace(/\/+$/, "");
};
