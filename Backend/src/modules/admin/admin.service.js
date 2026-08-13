import { adminRepository } from "./admin.repository.js";
import { ApiError } from "../../utils/ApiError.js";
import prisma from "../../config/prisma.js";

class AdminService {
  async getUsers(query) {
    const { page, limit, search, role, status, sortBy, order } = query;

    const skip = (page - 1) * limit;

    const where = {};

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },

        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (status) {
      where.status = status;
    }

    const { users, total } = await adminRepository.getUsers({
      skip,
      take: limit,
      where,

      orderBy: {
        [sortBy]: order,
      },
    });

    return {
      users,

      pagination: {
        total,

        page,

        limit,

        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateUser(id, data) {
    const existing = await prisma.user.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new ApiError(404, "User not found");
    }
    return adminRepository.updateUser(id, data);
  }

  async getCreators(query) {
    const { page, limit, search, status, sortBy, order } = query;

    const skip = (page - 1) * limit;

    const where = {};

    if (search) {
      where.OR = [
        {
          username: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          user: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          user: {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    if (status) {
      where.user = {
        status,
      };
    }

    where.user = {
      ...(where.user || {}),
      role: "CREATOR",
    };

    const { creators, total } = await adminRepository.getCreators({
      skip,
      take: limit,
      where,
      orderBy: {
        [sortBy]: order,
      },
    });

    return {
      creators,

      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getReports(query) {
    const {
      page,
      limit,
      search,
      action,
      entity,
      userId,
      startDate,
      endDate,
      sortBy,
      order,
    } = query;

    const skip = (page - 1) * limit;

    const where = {};

    if (search) {
      where.OR = [
        {
          action: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          entity: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          entityId: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (action) {
      where.action = {
        equals: action,
        mode: "insensitive",
      };
    }

    if (entity) {
      where.entity = {
        equals: entity,
        mode: "insensitive",
      };
    }

    if (userId) {
      where.userId = userId;
    }

    if (startDate || endDate) {
      where.createdAt = {};

      if (startDate) {
        where.createdAt.gte = startDate;
      }

      if (endDate) {
        where.createdAt.lte = endDate;
      }
    }

    const { reports, total } = await adminRepository.getReports({
      skip,
      take: limit,
      where,
      orderBy: {
        [sortBy]: order,
      },
    });

    return {
      reports,

      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const adminService = new AdminService();
