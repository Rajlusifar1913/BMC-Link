-- Support guest checkout flows while preserving authenticated payment ownership.
ALTER TABLE "payments" ALTER COLUMN "user_id" DROP NOT NULL;
ALTER TABLE "payments" DROP CONSTRAINT "payments_user_id_fkey";
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Razorpay identifiers are idempotency keys for payment processing.
CREATE UNIQUE INDEX "payments_gateway_order_id_key" ON "payments"("gateway_order_id");
CREATE UNIQUE INDEX "payments_gateway_payment_id_key" ON "payments"("gateway_payment_id");

CREATE TABLE "payment_webhook_events" (
  "id" TEXT NOT NULL,
  "gateway_event_id" TEXT NOT NULL,
  "event_type" TEXT NOT NULL,
  "payment_id" TEXT,
  "payload" JSONB NOT NULL,
  "processed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "payment_webhook_events_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "payment_webhook_events_gateway_event_id_key"
  ON "payment_webhook_events"("gateway_event_id");
CREATE INDEX "payment_webhook_events_payment_id_idx"
  ON "payment_webhook_events"("payment_id");

ALTER TABLE "payment_webhook_events" ADD CONSTRAINT "payment_webhook_events_payment_id_fkey"
  FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "memberships" ADD COLUMN "member_id" TEXT;
CREATE INDEX "memberships_member_id_idx" ON "memberships"("member_id");
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_member_id_fkey"
  FOREIGN KEY ("member_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "digital_products" ALTER COLUMN "file_url" DROP NOT NULL;
ALTER TABLE "purchases" ADD COLUMN "download_limit" INTEGER;
