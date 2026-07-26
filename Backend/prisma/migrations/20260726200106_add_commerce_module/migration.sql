-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESSFUL', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('DONATION', 'MEMBERSHIP', 'PREMIUM_SUBSCRIPTION', 'PRODUCT_PURCHASE');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PremiumStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "payment_gateways" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_gateways_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "payment_type" "PaymentType" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" CHAR(3) NOT NULL,
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "gateway_id" TEXT,
    "gateway_payment_id" TEXT,
    "order_id" TEXT,
    "gateway_order_id" TEXT,
    "gateway_signature" TEXT,
    "gateway_fee" DECIMAL(10,2),
    "tax" DECIMAL(10,2),
    "refund_amount" DECIMAL(10,2),
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donations" (
    "id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "supporter_id" TEXT,
    "display_name" TEXT,
    "email" TEXT,
    "is_anonymous" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membership_plans" (
    "id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "duration_days" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "membership_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memberships" (
    "id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "member_name" TEXT,
    "member_email" TEXT,
    "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "start_date" DATE,
    "end_date" DATE,
    "subscription_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "premium_plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "duration_days" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "premium_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "premium_subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "status" "PremiumStatus" NOT NULL DEFAULT 'ACTIVE',
    "start_date" DATE,
    "expiry_date" DATE,

    CONSTRAINT "premium_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_gateways_name_key" ON "payment_gateways"("name");

-- CreateIndex
CREATE INDEX "payments_user_id_idx" ON "payments"("user_id");

-- CreateIndex
CREATE INDEX "payments_gateway_id_idx" ON "payments"("gateway_id");

-- CreateIndex
CREATE UNIQUE INDEX "donations_payment_id_key" ON "donations"("payment_id");

-- CreateIndex
CREATE INDEX "donations_creator_id_idx" ON "donations"("creator_id");

-- CreateIndex
CREATE INDEX "donations_supporter_id_idx" ON "donations"("supporter_id");

-- CreateIndex
CREATE INDEX "membership_plans_creator_id_idx" ON "membership_plans"("creator_id");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_payment_id_key" ON "memberships"("payment_id");

-- CreateIndex
CREATE INDEX "memberships_creator_id_idx" ON "memberships"("creator_id");

-- CreateIndex
CREATE INDEX "memberships_plan_id_idx" ON "memberships"("plan_id");

-- CreateIndex
CREATE UNIQUE INDEX "premium_subscriptions_payment_id_key" ON "premium_subscriptions"("payment_id");

-- CreateIndex
CREATE INDEX "premium_subscriptions_user_id_idx" ON "premium_subscriptions"("user_id");

-- CreateIndex
CREATE INDEX "premium_subscriptions_plan_id_idx" ON "premium_subscriptions"("plan_id");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_gateway_id_fkey" FOREIGN KEY ("gateway_id") REFERENCES "payment_gateways"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_supporter_id_fkey" FOREIGN KEY ("supporter_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membership_plans" ADD CONSTRAINT "membership_plans_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "membership_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "premium_subscriptions" ADD CONSTRAINT "premium_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "premium_subscriptions" ADD CONSTRAINT "premium_subscriptions_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "premium_subscriptions" ADD CONSTRAINT "premium_subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "premium_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
