import { ApiError } from "../../utils/ApiError.js";

import linkRepository from "./links.repository.js";

import { getPagination } from "../../utils/pagination.js";
import { buildSearch } from "../../utils/queryBuilder.js";

class LinkService {

    async createLink(creatorId, payload) {

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
        } = payload;

        const finalPosition =
            position ?? (await linkRepository.getMaxPosition(creatorId)) + 1;

        return linkRepository.create({
            creatorId,
            title,
            url,
            type,
            icon,
            thumbnail,
            position: finalPosition,
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
            [query.sortBy || "position"]:
                query.order || "asc",
        };

        const [links, total] = await Promise.all([
            linkRepository.findByCreator(
                creatorId,
                {
                    skip,
                    limit,
                    where,
                    orderBy,
                }
            ),
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

        return linkRepository.update(id, payload);
    }

    async deleteLink(creatorId, id) {

        await this.getLink(creatorId, id);

        await linkRepository.delete(id);
    }

    async toggleLink(creatorId, id) {

        const link = await this.getLink(creatorId, id);

        return linkRepository.update(id, {
            isActive: !link.isActive,
        });
    }

    async duplicateLink(creatorId, id) {

        const link = await this.getLink(creatorId, id);

        const position =
            (await linkRepository.getMaxPosition(creatorId)) + 1;

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
        return linkRepository.reorderLinks(links);
    }

    async getPublicLinks(username) {

        return linkRepository.findPublicLinks(username);
    }

    async incrementClick(id) {

        return linkRepository.incrementClicks(id);
    }

}

export default new LinkService();