import { apiGet, apiPost } from "./api";
import type {
  CreateDonationPayload,
  Donation,
  PaymentOrderResult,
  VerifyPaymentPayload,
} from "./types";

const DONATIONS = "/api/v1/donations";

/**
 * POST /api/v1/donations/orders
 * Initiates a donation and returns Razorpay order details.
 */
export function createDonationOrder(
  payload: CreateDonationPayload
): Promise<PaymentOrderResult> {
  return apiPost<PaymentOrderResult>(`${DONATIONS}/orders`, payload);
}

/**
 * POST /api/v1/donations/verify
 * Verifies Razorpay checkout signature and records donation.
 */
export function verifyDonation(
  payload: VerifyPaymentPayload
): Promise<Donation> {
  return apiPost<Donation>(`${DONATIONS}/verify`, payload);
}

/**
 * GET /api/v1/donations/received
 * Returns list of donations received by the authenticated creator.
 */
export function getReceivedDonations(): Promise<Donation[]> {
  return apiGet<Donation[]>(`${DONATIONS}/received`);
}
