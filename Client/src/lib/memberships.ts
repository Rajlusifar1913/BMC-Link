import { apiGet, apiPost, apiPatch } from "./api";
import type {
  CreatePlanPayload,
  Membership,
  MembershipPlan,
  PaymentOrderResult,
  SubscribePlanPayload,
  UpdatePlanPayload,
  VerifyPaymentPayload,
} from "./types";

const MEMBERSHIPS = "/api/v1/memberships";

/**
 * GET /api/v1/memberships/plans
 * Creator: list own membership plans.
 */
export function getMyPlans(): Promise<MembershipPlan[]> {
  return apiGet<MembershipPlan[]>(`${MEMBERSHIPS}/plans`);
}

/**
 * POST /api/v1/memberships/plans
 * Creator: create a new membership plan.
 */
export function createPlan(payload: CreatePlanPayload): Promise<MembershipPlan> {
  return apiPost<MembershipPlan>(`${MEMBERSHIPS}/plans`, payload);
}

/**
 * PATCH /api/v1/memberships/plans/:id
 * Creator: update an existing membership plan.
 */
export function updatePlan(
  id: string,
  payload: UpdatePlanPayload
): Promise<MembershipPlan> {
  return apiPatch<MembershipPlan>(`${MEMBERSHIPS}/plans/${id}`, payload);
}

/**
 * GET /api/v1/memberships/public/:username
 * Public: list active membership plans for a creator.
 */
export function getPublicPlans(username: string): Promise<MembershipPlan[]> {
  return apiGet<MembershipPlan[]>(
    `${MEMBERSHIPS}/public/${encodeURIComponent(username)}`
  );
}

/**
 * POST /api/v1/memberships/subscribe
 * Visitor/Member: initiate subscription and receive Razorpay order.
 */
export function subscribePlan(
  payload: SubscribePlanPayload
): Promise<PaymentOrderResult> {
  return apiPost<PaymentOrderResult>(`${MEMBERSHIPS}/subscribe`, payload);
}

/**
 * POST /api/v1/memberships/verify
 * Verifies Razorpay checkout signature and creates membership.
 */
export function verifyMembership(
  payload: VerifyPaymentPayload
): Promise<Membership> {
  return apiPost<Membership>(`${MEMBERSHIPS}/verify`, payload);
}

/**
 * GET /api/v1/memberships/me
 * User: list memberships purchased by the current user.
 */
export function getMyMemberships(): Promise<Membership[]> {
  return apiGet<Membership[]>(`${MEMBERSHIPS}/me`);
}

/**
 * POST /api/v1/memberships/:id/cancel
 * User: cancel an active membership.
 */
export function cancelMembership(id: string): Promise<Membership> {
  return apiPost<Membership>(`${MEMBERSHIPS}/${id}/cancel`);
}
