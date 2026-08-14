import crypto from "crypto";
import Razorpay from "razorpay";
import prisma from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";

const currency = "INR";

class PaymentService {
  get client() {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new ApiError(503, "Payment gateway is not configured");
    }
    return new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder({ userId = null, paymentType, amount, metadata }) {
    if (!Number.isFinite(amount) || amount <= 0)
      throw new ApiError(400, "Amount must be greater than zero");
    const gateway = await prisma.paymentGateway.upsert({
      where: { name: "RAZORPAY" },
      update: {},
      create: { name: "RAZORPAY" },
    });
    const payment = await prisma.payment.create({
      data: {
        userId,
        paymentType,
        amount,
        currency,
        gatewayId: gateway.id,
        metadata,
      },
    });
    try {
      const order = await this.client.orders.create({
        amount: Math.round(Number(amount) * 100),
        currency,
        receipt: payment.id,
        notes: { paymentId: payment.id, paymentType },
      });
      await prisma.payment.update({
        where: { id: payment.id },
        data: { gatewayOrderId: order.id },
      });
      return {
        paymentId: payment.id,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      };
    } catch (error) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          paymentStatus: "FAILED",
          metadata: { ...metadata, gatewayError: error.message },
        },
      });
      throw new ApiError(502, "Unable to create payment order");
    }
  }

  async verifyCheckout({ orderId, paymentId, signature }) {
    const payment = await prisma.payment.findUnique({
      where: { gatewayOrderId: orderId },
    });
    if (!payment) throw new ApiError(404, "Payment order not found");
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(`${orderId}|${paymentId}`)
      .digest("hex");
    if (
      !signature ||
      !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
    )
      throw new ApiError(400, "Invalid payment signature");
    const duplicate = await prisma.payment.findUnique({
      where: { gatewayPaymentId: paymentId },
    });
    if (duplicate && duplicate.id !== payment.id)
      throw new ApiError(409, "Payment already belongs to another order");
    return prisma.payment.update({
      where: { id: payment.id },
      data: {
        paymentStatus: "SUCCESSFUL",
        gatewayPaymentId: paymentId,
        gatewaySignature: signature,
      },
    });
  }

  async receiveWebhook(rawBody, signature, eventId) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) throw new ApiError(503, "Payment webhook is not configured");
    const expected = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");
    if (
      !signature ||
      !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
    )
      throw new ApiError(400, "Invalid webhook signature");
    const payload = JSON.parse(rawBody.toString("utf8"));
    const uniqueEventId =
      eventId || crypto.createHash("sha256").update(rawBody).digest("hex");
    const orderId = payload?.payload?.payment?.entity?.order_id;
    const gatewayPaymentId = payload?.payload?.payment?.entity?.id;
    const payment = orderId
      ? await prisma.payment.findUnique({ where: { gatewayOrderId: orderId } })
      : null;
    try {
      await prisma.paymentWebhookEvent.create({
        data: {
          gatewayEventId: uniqueEventId,
          eventType: payload.event || "unknown",
          paymentId: payment?.id,
          payload,
        },
      });
    } catch (error) {
      if (error.code === "P2002") return { duplicate: true };
      throw error;
    }
    if (payment && gatewayPaymentId) {
      const status =
        payload.event === "payment.failed"
          ? "FAILED"
          : payload.event === "payment.captured"
            ? "SUCCESSFUL"
            : null;
      if (status)
        await prisma.payment.update({
          where: { id: payment.id },
          data: { paymentStatus: status, gatewayPaymentId },
        });
    }
    return { duplicate: false };
  }
}

export default new PaymentService();
