import prisma from "../../config/prisma.js";

class LinkRepository {
  async create(data) {
    return prisma.link.create({
      data,
    });
  }

  async createWithPosition(creatorId, data) {
    const position =
      data.position ?? (await this.getMaxPosition(creatorId)) + 1;

    return prisma.link.create({
      data: {
        ...data,
        creatorId,
        position,
      },
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

  async findByUserIdAndUrl(creatorId, url) {
    return prisma.link.findFirst({
      where: {
        creatorId,
        url,
      },
      select: {
        id: true,
      },
    });
  }

  async findByCreator(
    creatorId,
    { skip = 0, limit = 10, where = {}, orderBy = { position: "asc" } },
  ) {
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

  async incrementPositionsFrom(creatorId, fromPosition) {
    return prisma.link.updateMany({
      where: {
        creatorId,
        position: {
          gte: fromPosition,
        },
      },
      data: {
        position: {
          increment: 1,
        },
      },
    });
  }

  async decrementPositionsAfter(creatorId, fromPosition) {
    return prisma.link.updateMany({
      where: {
        creatorId,
        position: {
          gt: fromPosition,
        },
      },
      data: {
        position: {
          decrement: 1,
        },
      },
    });
  }

  async normalizePositions(creatorId, links) {
    return prisma.$transaction(
      links.map((item, index) =>
        prisma.link.update({
          where: {
            id: item.id,
          },
          data: {
            position: index + 1,
          },
        }),
      ),
    );
  }

  async findPublicLinks(username) {
    return prisma.user.findFirst({
      where: {
        creatorProfile: {
          username,
        },
      },
      select: {
        id: true,
        name: true,
        profilePicture: true,

        creatorProfile: {
          select: {
            username: true,
            headline: true,
            bio: true,
            avatar: true,
            coverImage: true,
            accentColor: true,
            website: true,
          },
        },

        links: {
          where: {
            isActive: true,
            OR: [
              {
                startDate: null,
                endDate: null,
              },
              {
                startDate: {
                  lte: new Date(),
                },
                OR: [
                  { endDate: null },
                  {
                    endDate: {
                      gte: new Date(),
                    },
                  },
                ],
              },
            ],
          },
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            title: true,
            url: true,
            type: true,
            icon: true,
            thumbnail: true,
            position: true,
            isFeatured: true,
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

  async reorderLinks(creatorId, links) {
    const updates = links.map((item) =>
      prisma.link.update({
        where: {
          id: item.id,
        },
        data: {
          position: item.position,
        },
      }),
    );

    return prisma.$transaction(updates);
  }
}

export default new LinkRepository();
