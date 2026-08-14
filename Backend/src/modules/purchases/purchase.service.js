import prisma from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import paymentService from "../payments/payment.service.js";
import storageService from "../media/storage.service.js";

class PurchaseService {
  async createOrder(data, buyerId = null) {
    const product = await prisma.digitalProduct.findFirst({
      where: {
        id: data.productId,
        status: "PUBLISHED",
        visibility: { in: ["PUBLIC", "UNLISTED"] },
        creator: { creatorSettings: { is: { allowProducts: true } } },
      },
    });
    if (!product) throw new ApiError(404, "Product is unavailable");
    return paymentService.createOrder({
      userId: buyerId,
      paymentType: "PRODUCT_PURCHASE",
      amount: Number(product.price),
      metadata: {
        productId: product.id,
        creatorId: product.creatorId,
        buyerId,
        buyerName: data.buyerName || null,
        buyerEmail: data.buyerEmail || null,
      },
    });
  }
  async verify(data) {
    const payment = await paymentService.verifyCheckout(data);
    if (payment.paymentType !== "PRODUCT_PURCHASE")
      throw new ApiError(400, "Invalid product payment");
    return prisma.$transaction(async (tx) => {
      const existing = await tx.purchase.findUnique({
        where: { paymentId: payment.id },
      });
      if (existing) return existing;
      const meta = payment.metadata || {};
      const product = await tx.digitalProduct.findUnique({
        where: { id: meta.productId },
      });
      if (!product) throw new ApiError(404, "Product not found");
      const purchase = await tx.purchase.create({
        data: {
          productId: product.id,
          paymentId: payment.id,
          buyerId: meta.buyerId,
          buyerName: meta.buyerName,
          buyerEmail: meta.buyerEmail,
          downloadLimit: product.downloadLimit,
          purchasedAt: new Date(),
        },
      });
      await tx.creatorAnalytics.upsert({
        where: { creatorId: product.creatorId },
        update: {
          totalSales: { increment: payment.amount },
          totalRevenue: { increment: payment.amount },
        },
        create: {
          creatorId: product.creatorId,
          totalSales: payment.amount,
          totalRevenue: payment.amount,
        },
      });
      return purchase;
    });
  }
  async history(buyerId) {
    return prisma.purchase.findMany({
      where: { buyerId },
      include: {
        product: {
          select: { id: true, title: true, slug: true, thumbnail: true },
        },
      },
      orderBy: { purchasedAt: "desc" },
    });
  }
  async listForCreator(creatorId) {
    return prisma.purchase.findMany({
      where: {
        product: { creatorId },
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            thumbnail: true,
          },
        },
        payment: {
          select: {
            amount: true,
            currency: true,
            paymentStatus: true,
            createdAt: true,
          },
        },
      },
      orderBy: { purchasedAt: "desc" },
    });
  }
  async download(buyerId, purchaseId) {
    const purchase = await prisma.purchase.findFirst({
      where: { id: purchaseId, buyerId },
      include: { product: true },
    });
    if (!purchase) throw new ApiError(404, "Purchase not found");
    if (purchase.expiresAt && purchase.expiresAt < new Date())
      throw new ApiError(403, "Purchase has expired");
    if (
      purchase.downloadLimit !== null &&
      purchase.downloadCount >= purchase.downloadLimit
    )
      throw new ApiError(403, "Download limit exceeded");
    if (!purchase.product.fileUrl)
      throw new ApiError(404, "Product file not found");
    const file = await storageService.openPrivate(purchase.product.fileUrl);
    await prisma.purchase.update({
      where: { id: purchase.id },
      data: { downloadCount: { increment: 1 } },
    });
    return { file, name: purchase.product.title.replace(/[\\/:*?"<>|]/g, "_") };
  }
}
export default new PurchaseService();
