import { apiGet, apiPatch } from "./api";
import type {
  AdminCreator,
  AdminReport,
  AdminUser,
  GetCreatorsAdminQuery,
  GetReportsAdminQuery,
  GetUsersAdminQuery,
  UserRole,
  UserStatus,
} from "./types";

const ADMIN = "/api/v1/admin";

function toQueryString(params: Record<string, unknown>): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  if (!entries.length) return "";
  return "?" + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
}

/**
 * GET /api/v1/admin/users
 * Admin: list users with pagination and search/filters.
 */
export function getAdminUsers(
  query: GetUsersAdminQuery = {}
): Promise<{ users: AdminUser[]; pagination: { total: number; page: number; limit: number; totalPages: number } }> {
  return apiGet(`${ADMIN}/users${toQueryString(query as Record<string, unknown>)}`);
}

/**
 * PATCH /api/v1/admin/users/:id
 * Admin: update a user's role, status, verification, etc.
 */
export function updateAdminUser(
  id: string,
  payload: { role?: UserRole; status?: UserStatus; isVerified?: boolean }
): Promise<AdminUser> {
  return apiPatch<AdminUser>(`${ADMIN}/users/${id}`, payload);
}

/**
 * GET /api/v1/admin/creators
 * Admin: list creator profiles with pagination and search/filters.
 */
export function getAdminCreators(
  query: GetCreatorsAdminQuery = {}
): Promise<{ creators: AdminCreator[]; pagination: { total: number; page: number; limit: number; totalPages: number } }> {
  return apiGet(`${ADMIN}/creators${toQueryString(query as Record<string, unknown>)}`);
}

/**
 * GET /api/v1/admin/reports
 * Admin: audit logs and administrative reports.
 */
export function getAdminReports(
  query: GetReportsAdminQuery = {}
): Promise<{ reports: AdminReport[]; pagination: { total: number; page: number; limit: number; totalPages: number } }> {
  return apiGet(`${ADMIN}/reports${toQueryString(query as Record<string, unknown>)}`);
}
