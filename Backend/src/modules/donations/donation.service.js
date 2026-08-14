import prisma from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import paymentService from "../payments/payment.service.js";

class DonationService {
  async createOrder(data) {
    const profile = await prisma.creatorProfile.findUnique({
      where: { username: data.username },
      include: { user: { include: { creatorSettings: true } } },
    });
    if (!profile || profile.user.status !== "ACTIVE")
      throw new ApiError(404, "Creator not found");
    if (
      profile.user.creatorSettings &&
      !profile.user.creatorSettings.allowDonations
    )
      throw new ApiError(403, "This creator is not accepting donations");
    return paymentService.createOrder({
      paymentType: "DONATION",
      amount: data.amount,
      metadata: {
        creatorId: profile.userId,
        displayName: data.isAnonymous ? null : data.name || null,
        email: data.email || null,
        message: data.message || null,
        isAnonymous: Boolean(data.isAnonymous),
      },
    });
  }
  async verify(data) {
    const payment = await paymentService.verifyCheckout(data);
    if (payment.paymentType !== "DONATION")
      throw new ApiError(400, "Invalid donation payment");
    const donation = await prisma.$transaction(async (tx) => {
      const existing = await tx.donation.findUnique({
        where: { paymentId: payment.id },
      });
      if (existing) return existing;
      const metadata = payment.metadata || {};
      const created = await tx.donation.create({
        data: {
          creatorId: metadata.creatorId,
          paymentId: payment.id,
          displayName: metadata.displayName,
          email: metadata.email,
          message: metadata.message,
          isAnonymous: metadata.isAnonymous || false,
        },
      });
      await tx.creatorAnalytics.upsert({
        where: { creatorId: metadata.creatorId },
        update: {
          totalDonations: { increment: payment.amount },
          totalRevenue: { increment: payment.amount },
        },
        create: {
          creatorId: metadata.creatorId,
          totalDonations: payment.amount,
          totalRevenue: payment.amount,
        },
      });
      return created;
    });
    return donation;
  }
  async listForCreator(creatorId) {
    return prisma.donation.findMany({
      where: { creatorId },
      include: {
        payment: {
          select: { amount: true, currency: true, paymentStatus: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
export default new DonationService();
