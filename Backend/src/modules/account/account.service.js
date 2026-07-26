import { ApiError } from "../../utils/ApiError.js";
import accountRepository from "./account.repository.js";

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

        await accountRepository.updateUser(userId, {
            name,
            phone,
            profilePicture,
            timezone,
            language,
        });

        await accountRepository.updateCreatorProfile(userId, {
            headline,
            bio,
            avatar,
            coverImage,
            website,
            accentColor,
            themeId,
        });

        return this.getProfile(userId);
    }
}

export default new AccountService();