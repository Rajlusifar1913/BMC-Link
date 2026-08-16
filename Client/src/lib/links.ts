import { apiGet, apiPost, apiPatch, apiDelete } from "./api";
import type {
  Link,
  PaginatedResponse,
  PublicProfile,
  CreateLinkPayload,
  UpdateLinkPayload,
  ReorderItem,
  GetLinksQuery,
} from "./types";

const LINKS = "/api/v1/links";

// ─── Helper: build query string ───────────────────────────────────────────────

function toQueryString(params: Record<string, unknown>): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  if (!entries.length) return "";
  return "?" + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
}

// ─── Creator (authenticated) endpoints ───────────────────────────────────────

/**
 * GET /api/v1/links/
 * Returns paginated links for the authenticated creator.
 */
export function getLinks(
  query: GetLinksQuery = {}
): Promise<PaginatedResponse<Link>> {
  return apiGet<PaginatedResponse<Link>>(
    `${LINKS}/${toQueryString(query as Record<string, unknown>)}`
  );
}

/**
 * GET /api/v1/links/:id
 * Returns a single link owned by the authenticated creator.
 */
export function getLink(id: string): Promise<Link> {
  return apiGet<Link>(`${LINKS}/${id}`);
}

/**
 * POST /api/v1/links/
 * Creates a new link for the authenticated creator.
 */
export function createLink(payload: CreateLinkPayload): Promise<Link> {
  return apiPost<Link>(`${LINKS}/`, payload);
}

/**
 * PATCH /api/v1/links/:id
 * Partially updates a link owned by the authenticated creator.
 */
export function updateLink(
  id: string,
  payload: UpdateLinkPayload
): Promise<Link> {
  return apiPatch<Link>(`${LINKS}/${id}`, payload);
}

/**
 * DELETE /api/v1/links/:id
 * Deletes a link owned by the authenticated creator.
 */
export function deleteLink(id: string): Promise<null> {
  return apiDelete<null>(`${LINKS}/${id}`);
}

/**
 * PATCH /api/v1/links/toggle/:id
 * Flips the isActive flag on a link.
 */
export function toggleLink(id: string): Promise<Link> {
  return apiPatch<Link>(`${LINKS}/toggle/${id}`);
}

/**
 * POST /api/v1/links/duplicate/:id
 * Duplicates a link (appends " Copy" to title, sets isActive=false).
 */
export function duplicateLink(id: string): Promise<Link> {
  return apiPost<Link>(`${LINKS}/duplicate/${id}`);
}

/**
 * PATCH /api/v1/links/reorder
 * Reorders links by providing an array of { id, position } objects.
 */
export function reorderLinks(links: ReorderItem[]): Promise<null> {
  return apiPatch<null>(`${LINKS}/reorder`, { links });
}

// ─── Public endpoint ──────────────────────────────────────────────────────────

/**
 * GET /api/v1/links/public/:username
 * Returns the public active links (and creator profile) for a given username.
 * No auth required.
 */
export function getPublicLinks(
  username: string
): Promise<PublicProfile & { links: Link[] }> {
  return apiGet<PublicProfile & { links: Link[] }>(
    `${LINKS}/public/${encodeURIComponent(username)}`
  );
}
