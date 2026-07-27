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
            select: {
                id: true,
                username: true,
                headline: true,
                bio: true,
                avatar: true,
                coverImage: true,
                website: true,
                accentColor: true,
                theme: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                user: {
                    select: {
                        name: true,
                        profilePicture: true
                    }
                }
            }
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

    async updateProfileTransaction(userId, userUpdateData, creatorProfileUpdateData) {
        return prisma.$transaction(async (tx) => {
            let updatedUser, updatedCreatorProfile;

            if (Object.keys(userUpdateData).length > 0) {
                updatedUser = await tx.user.update({
                    where: { id: userId },
                    data: userUpdateData,
                });
            }

            if (Object.keys(creatorProfileUpdateData).length > 0) {
                updatedCreatorProfile = await tx.creatorProfile.update({
                    where: { userId },
                    data: creatorProfileUpdateData,
                });
            }

            return { updatedUser, updatedCreatorProfile };
        });
    }
}

export default new AccountRepository();