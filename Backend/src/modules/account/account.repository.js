import prisma from "../../config/prisma.js";

class AccountRepository {
    async findProfileByUserId(userId) {
        return prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                profilePicture: true,
                timezone: true,
                language: true,
                creatorProfile: {
                    include: {
                        theme: true,
                    },
                },
            },
        });
    }

    async findPublicProfile(username) {
        return prisma.creatorProfile.findUnique({
            where: {
                username,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        profilePicture: true,
                    },
                },
                theme: true,
            },
        });
    }

    async findUsername(username) {
        return prisma.creatorProfile.findUnique({
            where: {
                username,
            },
            select: {
                id: true,
            },
        });
    }

    async updateUser(userId, data) {
        return prisma.user.update({
            where: {
                id: userId,
            },
            data,
        });
    }

    async updateCreatorProfile(userId, data) {
        return prisma.creatorProfile.update({
            where: {
                userId,
            },
            data,
        });
    }
}

export default new AccountRepository();