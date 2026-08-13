import { ApiError } from "../../utils/ApiError.js";

import linkRepository from "./links.repository.js";

import { getPagination } from "../../utils/pagination.js";
import { buildSearch } from "../../utils/queryBuilder.js";

class LinkService {
  async createLink(creatorId, payload) {
    const normalizedPayload = {
      ...payload,
      title: payload.title === "" ? null : payload.title,
      icon: payload.icon === "" ? null : payload.icon,
      thumbnail: payload.thumbnail === "" ? null : payload.thumbnail,
    };

    const {
      title,
      url,
      type,
      icon,
      thumbnail,
      position,
      isFeatured = false,
      isActive = true,
      startDate,
      endDate,
    } = normalizedPayload;

    const existingLink = await linkRepository.findByUserIdAndUrl(
      creatorId,
      url,
    );

    if (existingLink) {
      throw new ApiError(409, "This link already exists.");
    }

    return linkRepository.createWithPosition(creatorId, {
      creatorId,
      title,
      url,
      type,
      icon,
      thumbnail,
      position,
      isFeatured,
      isActive,
      startDate,
      endDate,
    });
  }

  async getCreatorLinks(creatorId, query) {
    const { skip, limit, page } = getPagination(query);

    const where = {
      ...buildSearch(query.search, ["title"]),
    };

    if (query.type) {
      where.type = query.type;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive === "true";
    }

    const orderBy = {
      [query.sortBy || "position"]: query.order || "asc",
    };

    const [links, total] = await Promise.all([
      linkRepository.findByCreator(creatorId, {
        skip,
        limit,
        where,
        orderBy,
      }),
      linkRepository.countByCreator(creatorId, where),
    ]);

    return {
      items: links,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getLink(creatorId, id) {
    const link = await linkRepository.findByIdAndCreator(id, creatorId);

    if (!link) {
      throw new ApiError(404, "Link not found");
    }

    return link;
  }

  async updateLink(creatorId, id, payload) {
    await this.getLink(creatorId, id);

    const normalizedPayload = {
      ...payload,
      title: payload.title === "" ? null : payload.title,
      icon: payload.icon === "" ? null : payload.icon,
      thumbnail: payload.thumbnail === "" ? null : payload.thumbnail,
    };

    return linkRepository.update(id, normalizedPayload);
  }

  async deleteLink(creatorId, id) {
    await this.getLink(creatorId, id);

    await linkRepository.delete(id);
  }

  async toggleLink(creatorId, id) {
    const link = await this.getLink(creatorId, id);

    console.log("Before:", link.isActive);

    const updated = await linkRepository.update(id, {
      isActive: !link.isActive,
    });
    console.log("After:", updated.isActive);

    return updated;
  }

  async duplicateLink(creatorId, id) {
    const link = await this.getLink(creatorId, id);

    const position = (await linkRepository.getMaxPosition(creatorId)) + 1;

    return linkRepository.create({
      creatorId,

      title: link.title ? `${link.title} Copy` : null,

      url: link.url,

      type: link.type,

      icon: link.icon,

      thumbnail: link.thumbnail,

      position,

      isFeatured: false,

      isActive: false,
    });
  }

  async reorderLinks(creatorId, links) {
    // Verify all links belong to this creator before reordering
    for (const item of links) {
      await this.getLink(creatorId, item.id);
    }

    return linkRepository.reorderLinks(creatorId, links);
  }

  async getPublicLinks(username) {
    const profile = await linkRepository.findPublicLinks(username);

    if (!profile) {
      throw new ApiError(404, "Creator not found");
    }

    return profile;
  }

  async incrementClick(id) {
    return linkRepository.incrementClicks(id);
  }
}

export default new LinkService();
