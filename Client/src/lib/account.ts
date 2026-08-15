import { apiGet, apiPatch } from "./api";
import type {
  User,
  PublicProfile,
  UpdateProfilePayload,
  CheckUsernameResult,
} from "./types";

const ACCOUNT = "/api/v1/account";

/**
 * GET /api/v1/account/
 * Returns the full profile of the authenticated user,
 * including their CreatorProfile and Theme.
 */
export function getProfile(): Promise<User> {
  return apiGet<User>(`${ACCOUNT}/`);
}

/**
 * PATCH /api/v1/account/
 * Partially updates the authenticated user's profile.
 * Only include fields you want to change.
 */
export function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  return apiPatch<User>(`${ACCOUNT}/`, payload);
}

/**
 * GET /api/v1/account/:username
 * Returns a public-facing creator profile (no auth required).
 */
export function getPublicProfile(username: string): Promise<PublicProfile> {
  return apiGet<PublicProfile>(`${ACCOUNT}/${username}`);
}

/**
 * GET /api/v1/account/check-username/:username
 * Returns { username, available: boolean }.
 * No auth required.
 */
export function checkUsername(
  username: string
): Promise<CheckUsernameResult> {
  return apiGet<CheckUsernameResult>(
    `${ACCOUNT}/check-username/${encodeURIComponent(username)}`
  );
}
