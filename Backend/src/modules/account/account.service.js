import { ApiError } from "../../utils/ApiError.js";
import accountRepository from "./account.repository.js";
import prisma from "../../config/prisma.js";

class AccountService {

    async getProfile(userId) {
        const profile = await accountRepository.findProfileByUserId(userId);

        if (!profile) {
            throw new ApiError(404, "Profile not found");
        }

        return profile;
    }

    async getPublicProfile(username) {
        const profile = await accountRepository.findPublicProfile(username);

        if (!profile) {
            throw new ApiError(404, "Creator not found");
        }

        return profile;
    }

    async checkUsername(username) {
        const exists = await accountRepository.findUsername(username);

        return {
            username,
            available: !exists,
        };
    }

    async updateProfile(userId, payload) {

        const {
            name,
            phone,
            profilePicture,
            timezone,
            language,
            headline,
            bio,
            avatar,
            coverImage,
            website,
            accentColor,
            themeId,
        } = payload;

        // Filter out undefined values to avoid overwriting existing data with nulls
        const userUpdateData = Object.fromEntries(
            Object.entries({
                name,
                phone,
                profilePicture,
                timezone,
                language,
            }).filter(([_, v]) => v !== undefined)
        );

        const creatorProfileUpdateData = Object.fromEntries(
            Object.entries({
                headline,
                bio,
                avatar,
                coverImage,
                website,
                accentColor,
                themeId,
            }).filter(([_, v]) => v !== undefined)
        );

        if (
            Object.keys(userUpdateData).length === 0 &&
            Object.keys(creatorProfileUpdateData).length === 0
        ) {
            throw new ApiError(400, "No fields provided for update");
        }

        if (themeId !== undefined && themeId !== null) {
            const theme = await prisma.theme.findUnique({
                where: { id: themeId }
            });

            if (!theme) {
                throw new ApiError(404, "Theme not found");
            }
        }

        await accountRepository.updateProfileTransaction(
            userId,
            userUpdateData,
            creatorProfileUpdateData
        );

        return this.getProfile(userId);
    }
}

export default new AccountService();
