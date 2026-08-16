import test from "node:test";
import assert from "node:assert/strict";

import {
	normalizeAllowedOrigins,
	timingSafeEqualHex,
	getServerBaseUrl,
} from "../src/utils/security.js";

test("normalizeAllowedOrigins handles comma-separated origins and strips whitespace", () => {
	assert.deepEqual(normalizeAllowedOrigins("https://app.example.com, https://admin.example.com"), [
		"https://app.example.com",
		"https://admin.example.com",
	]);
});

test("timingSafeEqualHex rejects mismatched-length signatures", () => {
	assert.equal(timingSafeEqualHex("abcdef", "abc"), false);
	assert.equal(timingSafeEqualHex("abcd", "abcd"), true);
});

test("getServerBaseUrl resolves a clean production URL", () => {
	assert.equal(
		getServerBaseUrl({ PORT: "4800", SERVER_URL: "https://api.example.com/" }),
		"https://api.example.com",
	);
});
