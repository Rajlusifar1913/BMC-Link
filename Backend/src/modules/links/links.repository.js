import prisma from "../../config/prisma.js";

class LinkRepository {

    async create(data) {
        return prisma.link.create({
            data,
        });
    }

    async findById(id) {
        return prisma.link.findUnique({
            where: {
                id,
            },
        });
    }

    async findByIdAndCreator(id, creatorId) {
        return prisma.link.findFirst({
            where: {
                id,
                creatorId,
            },
        });
    }

    async findByCreator(creatorId, { skip = 0, limit = 10, where = {}, orderBy = { position: "asc" } }) {
        return prisma.link.findMany({
            where: {
                creatorId,
                ...where,
            },
            select: {
                id: true,
                title: true,
                url: true,
                type: true,
                icon: true,
                thumbnail: true,
                position: true,
                clickCount: true,
                isFeatured: true,
                isActive: true,
                startDate: true,
                endDate: true,
                createdAt: true,
            },
            skip,
            take: limit,
            orderBy,
        });
    }

    async countByCreator(creatorId, where = {}) {
        return prisma.link.count({
            where: {
                creatorId,
                ...where,
            },
        });
    }

    async update(id, data) {
        return prisma.link.update({
            where: {
                id,
            },
            data,
        });
    }

    async delete(id) {
        return prisma.link.delete({
            where: {
                id,
            },
        });
    }

    async getMaxPosition(creatorId) {
        const lastLink = await prisma.link.findFirst({
            where: {
                creatorId,
            },
            orderBy: {
                position: "desc",
            },
            select: {
                position: true,
            },
        });

        return lastLink?.position ?? 0;
    }

    async findPublicLinks(username) {
        return prisma.link.findMany({
            where: {
                isActive: true,
                creator: {
                    creatorProfile: {
                        username,
                    },
                },
            },
            orderBy: {
                position: "asc",
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        creatorProfile: {
                            select: {
                                username: true,
                                headline: true,
                                avatar: true,
                                accentColor: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async incrementClicks(id) {
        return prisma.link.update({
            where: {
                id,
            },
            data: {
                clickCount: {
                    increment: 1,
                },
            },
        });
    }

    async reorderLinks(data) {
        return prisma.$transaction(
            data.map(item =>
                prisma.link.update({
                    where: {
                        id: item.id,
                    },
                    data: {
                        position: item.position,
                    },
                })
            )
        );
    }
}

export default new LinkRepository();