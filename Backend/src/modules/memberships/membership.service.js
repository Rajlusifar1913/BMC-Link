import prisma from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import paymentService from "../payments/payment.service.js";

class MembershipService {
  async own(creatorId, id) {
    const plan = await prisma.membershipPlan.findFirst({
      where: { id, creatorId },
    });
    if (!plan) throw new ApiError(404, "Membership plan not found");
    return plan;
  }
  createPlan(creatorId, data) {
    return prisma.membershipPlan.create({ data: { creatorId, ...data } });
  }
  async updatePlan(creatorId, id, data) {
    await this.own(creatorId, id);
    return prisma.membershipPlan.update({ where: { id }, data });
  }
  listMine(creatorId) {
    return prisma.membershipPlan.findMany({
      where: { creatorId },
      orderBy: { createdAt: "desc" },
    });
  }
  async listPublic(username) {
    const creator = await prisma.creatorProfile.findUnique({
      where: { username },
      include: { user: { include: { creatorSettings: true } } },
    });
    if (
      !creator ||
      (creator.user.creatorSettings &&
        !creator.user.creatorSettings.allowMemberships)
    )
      throw new ApiError(404, "Creator not found");
    return prisma.membershipPlan.findMany({
      where: { creatorId: creator.userId, isActive: true },
    });
  }
  async subscribe(data, memberId = null) {
    const plan = await prisma.membershipPlan.findUnique({
      where: { id: data.planId },
      include: { creator: { include: { creatorSettings: true } } },
    });
    if (
      !plan ||
      !plan.isActive ||
      (plan.creator.creatorSettings &&
        !plan.creator.creatorSettings.allowMemberships)
    )
      throw new ApiError(404, "Membership plan is unavailable");
    return paymentService.createOrder({
      userId: memberId,
      paymentType: "MEMBERSHIP",
      amount: Number(plan.price),
      metadata: {
        creatorId: plan.creatorId,
        planId: plan.id,
        memberId,
        memberName: data.memberName || null,
        memberEmail: data.memberEmail || null,
      },
    });
  }
  async verify(data) {
    const payment = await paymentService.verifyCheckout(data);
    if (payment.paymentType !== "MEMBERSHIP")
      throw new ApiError(400, "Invalid membership payment");
    return prisma.$transaction(async (tx) => {
      const existing = await tx.membership.findUnique({
        where: { paymentId: payment.id },
      });
      if (existing) return existing;
      const meta = payment.metadata || {};
      const plan = await tx.membershipPlan.findUnique({
        where: { id: meta.planId },
      });
      if (!plan) throw new ApiError(404, "Membership plan not found");
      const start = new Date();
      const end = new Date(start);
      end.setDate(end.getDate() + plan.durationDays);
      const membership = await tx.membership.create({
        data: {
          creatorId: meta.creatorId,
          planId: plan.id,
          paymentId: payment.id,
          memberId: meta.memberId,
          memberName: meta.memberName,
          memberEmail: meta.memberEmail,
          startDate: start,
          endDate: end,
        },
      });
      await tx.creatorAnalytics.upsert({
        where: { creatorId: meta.creatorId },
        update: { totalRevenue: { increment: payment.amount } },
        create: { creatorId: meta.creatorId, totalRevenue: payment.amount },
      });
      return membership;
    });
  }
  listMemberships(memberId) {
    return prisma.membership.findMany({
      where: { memberId },
      include: {
        plan: true,
        creator: { select: { creatorProfile: { select: { username: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
  }
  async cancel(memberId, id) {
    const membership = await prisma.membership.findFirst({
      where: { id, memberId },
    });
    if (!membership) throw new ApiError(404, "Membership not found");
    return prisma.membership.update({
      where: { id },
      data: { status: "CANCELLED" },
    });
  }
}
export default new MembershipService();
