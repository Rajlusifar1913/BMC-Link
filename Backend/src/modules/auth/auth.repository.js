import crypto from "crypto";

import prisma from "../../config/prisma.js";

class AuthRepository {

    async findOrCreateGoogleUser(profile) {

        const email = profile.emails?.[0]?.value?.toLowerCase();

        if (!email) {
            throw new Error("Google account email not found");
        }

        let user = await prisma.user.findFirst({
            where: {
                email,
                deletedAt: null
            }
        });

        if (user) {

            const updatedUser = await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    authId: user.authId || profile.id,
                    profilePicture:
                        profile.photos?.[0]?.value ||
                        user.profilePicture,
                    isVerified: true,
                    lastLogin: new Date(),
                }
            });

            await this.ensureCreatorProfile(updatedUser, profile);

            return updatedUser;
        }

        const username =
            email.split("@")[0] +
            "_" +
            crypto.randomBytes(3).toString("hex");

        const createdUser = await prisma.user.create({
            data: {
                email,
                authId: profile.id,
                name: profile.displayName || email.split("@")[0],
                profilePicture: profile.photos?.[0]?.value || null,
                isVerified: true,
                lastLogin: new Date(),
            }
        });

        await prisma.creatorProfile.create({
            data: {
                userId: createdUser.id,
                username,
                avatar: profile.photos?.[0]?.value || null,
            }
        });

        return createdUser;

    }

    async ensureCreatorProfile(user, profile) {

        const existingProfile = await prisma.creatorProfile.findUnique({
            where: {
                userId: user.id,
            },
        });

        if (existingProfile) {
            return existingProfile;
        }

        const baseUsername =
            (profile.emails?.[0]?.value?.split("@")[0] || "creator")
                .toLowerCase()
                .replace(/[^a-z0-9_]/g, "_");

        let username = baseUsername;
        let suffix = 0;

        while (await prisma.creatorProfile.findUnique({ where: { username } })) {
            suffix += 1;
            username = `${baseUsername}_${suffix}`;
        }

        return prisma.creatorProfile.create({
            data: {
                userId: user.id,
                username,
                avatar: profile.photos?.[0]?.value || user.profilePicture || null,
            },
        });
    }

    async createSession({
        userId,
        refreshTokenHash,
        userAgent,
        ipAddress,
        expiresAt,
    }) {

        return prisma.userSession.create({
            data: {
                userId,
                refreshToken:
                    refreshTokenHash || crypto.randomUUID(),
                userAgent,
                ipAddress,
                expiresAt,
            }
        });

    }

    async findSessionById(sessionId) {

        return prisma.userSession.findUnique({
            where: {
                id: sessionId
            }
        });

    }

    async updateSessionToken(sessionId, refreshTokenHash) {

        return prisma.userSession.update({
            where: {
                id: sessionId
            },
            data: {
                refreshToken: refreshTokenHash,
                lastUsedAt: new Date()
            }
        });

    }

    async deleteSession(sessionId) {

        return prisma.userSession.delete({
            where: {
                id: sessionId
            }
        });

    }

    async deleteAllSessions(userId) {

        return prisma.userSession.deleteMany({
            where: {
                userId
            }
        });

    }

    async findUserById(userId) {

        return prisma.user.findFirst({
            where: {
                id: userId,
                deletedAt: null,
                status: "ACTIVE"
            }
        });

    }

}

export default new AuthRepository();
