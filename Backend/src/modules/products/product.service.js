import prisma from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { createSlug } from "../../utils/slug.js";
import storageService from "../media/storage.service.js";

const details = { category: true, tags: { include: { tag: true } } };
class ProductService {
  async uniqueSlug(title) {
    let slug = createSlug(title) || "product";
    let candidate = slug;
    let n = 1;
    while (
      await prisma.digitalProduct.findUnique({ where: { slug: candidate } })
    )
      candidate = `${slug}-${n++}`;
    return candidate;
  }
  async create(creatorId, data) {
    const slug = await this.uniqueSlug(data.title);
    if (
      data.categoryId &&
      !(await prisma.productCategory.findUnique({
        where: { id: data.categoryId },
      }))
    )
      throw new ApiError(404, "Category not found");
    return prisma.digitalProduct.create({
      data: {
        ...data,
        tagIds: undefined,
        creatorId,
        slug,
        tags: data.tagIds
          ? { create: data.tagIds.map((tagId) => ({ tagId })) }
          : undefined,
      },
      include: details,
    });
  }
  async mine(creatorId) {
    return prisma.digitalProduct.findMany({
      where: { creatorId },
      include: details,
      orderBy: { createdAt: "desc" },
    });
  }
  async owned(creatorId, id) {
    const product = await prisma.digitalProduct.findFirst({
      where: { id, creatorId },
      include: details,
    });
    if (!product) throw new ApiError(404, "Product not found");
    return product;
  }
  async update(creatorId, id, data) {
    await this.owned(creatorId, id);
    if (
      data.categoryId &&
      !(await prisma.productCategory.findUnique({
        where: { id: data.categoryId },
      }))
    )
      throw new ApiError(404, "Category not found");
    const { tagIds, ...fields } = data;
    return prisma.digitalProduct.update({
      where: { id },
      data: {
        ...fields,
        tags: tagIds
          ? { deleteMany: {}, create: tagIds.map((tagId) => ({ tagId })) }
          : undefined,
      },
      include: details,
    });
  }
  async publish(creatorId, id, published) {
    const product = await this.owned(creatorId, id);
    if (published && !product.fileUrl)
      throw new ApiError(400, "Upload a product file before publishing");
    return prisma.digitalProduct.update({
      where: { id },
      data: { status: published ? "PUBLISHED" : "DRAFT" },
    });
  }
  async archive(creatorId, id) {
    await this.owned(creatorId, id);
    return prisma.digitalProduct.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });
  }
  async uploadFile(creatorId, id, file) {
    await this.owned(creatorId, id);
    const saved = await storageService.save(file);
    await prisma.media.create({
      data: {
        ownerId: creatorId,
        fileName: saved.fileName,
        fileUrl: saved.key,
        mimeType: saved.mimeType,
        size: BigInt(saved.size),
        storageProvider: saved.provider,
      },
    });
    return prisma.digitalProduct.update({
      where: { id },
      data: { fileUrl: saved.key },
    });
  }
  async uploadThumbnail(creatorId, id, file) {
    await this.owned(creatorId, id);
    const saved = await storageService.save(file, "public");
    await prisma.media.create({
      data: {
        ownerId: creatorId,
        fileName: saved.fileName,
        fileUrl: saved.key,
        mimeType: saved.mimeType,
        size: BigInt(saved.size),
        storageProvider: saved.provider,
      },
    });
    return prisma.digitalProduct.update({
      where: { id },
      data: { thumbnail: `/storage/${saved.key}` },
    });
  }
  async publicList(username) {
    return prisma.digitalProduct.findMany({
      where: {
        creator: {
          creatorProfile: { username },
          creatorSettings: { is: { allowProducts: true } },
        },
        status: "PUBLISHED",
        visibility: "PUBLIC",
      },
      include: details,
      orderBy: { createdAt: "desc" },
    });
  }
  async publicOne(username, slug) {
    const product = await prisma.digitalProduct.findFirst({
      where: {
        slug,
        creator: { creatorProfile: { username } },
        status: "PUBLISHED",
        visibility: { in: ["PUBLIC", "UNLISTED"] },
      },
      include: details,
    });
    if (!product) throw new ApiError(404, "Product not found");
    return product;
  }
}
export default new ProductService();
