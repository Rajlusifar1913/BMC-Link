import prisma from "../../config/prisma.js";

class AdminRepository {

	async getUsers({
		skip,
		take,
		where,
		orderBy
	}) {

		const [users, total] = await prisma.$transaction([

			prisma.user.findMany({
				where,
				skip,
				take,
				orderBy,

				select: {
					id: true,
					name: true,
					email: true,
					profilePicture: true,
					role: true,
					status: true,
					createdAt: true,
					lastLogin: true,

					creatorProfile: {
						select: {
							username: true,
						}
					}
				}
			}),

			prisma.user.count({
				where
			})

		]);

		return {
			users,
			total
		};

	}

	async updateUser(id, data) {

		return prisma.user.update({
			where: { id },
			data,
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				status: true
			}
		});

	}

	async getCreators({
		skip,
		take,
		where,
		orderBy
	}) {

		const [creators, total] = await prisma.$transaction([
			prisma.creatorProfile.findMany({
				where,
				skip,
				take,
				orderBy,

				select: {
					id: true,
					username: true,
					headline: true,
					bio: true,
					avatar: true,
					coverImage: true,
					website: true,
					accentColor: true,
					createdAt: true,
					updatedAt: true,

					user: {
						select: {
							id: true,
							name: true,
							email: true,
							profilePicture: true,
							status: true,
							role: true,
							createdAt: true,
							lastLogin: true
						}
					}
				}
			}),

			prisma.creatorProfile.count({
				where
			})
		]);

		return {
			creators,
			total
		};
	}

	async getReports({
		skip,
		take,
		where,
		orderBy
	}) {

		const [reports, total] = await prisma.$transaction([

			prisma.auditLog.findMany({
				where,
				skip,
				take,
				orderBy,

				select: {
					id: true,
					action: true,
					entity: true,
					entityId: true,
					oldData: true,
					newData: true,
					ip: true,
					userAgent: true,
					createdAt: true,

					user: {
						select: {
							id: true,
							name: true,
							email: true,
							role: true
						}
					}
				}
			}),

			prisma.auditLog.count({
				where
			})

		]);

		return {
			reports,
			total
		};
	}

}

export const adminRepository = new AdminRepository();