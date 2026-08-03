/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         profilePicture:
 *           type: string
 *           nullable: true
 *         role:
 *           type: string
 *         status:
 *           type: string
 *
 *     RefreshTokenRequest:
 *       type: object
 *       properties:
 *         refreshToken:
 *           type: string
 *           example: eyJhbGciOiJIUzI1Ni...
 *
 *     UpdateProfileRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         phone:
 *           type: string
 *         profilePicture:
 *           type: string
 *           format: uri
 *         timezone:
 *           type: string
 *         language:
 *           type: string
 *         headline:
 *           type: string
 *         bio:
 *           type: string
 *         avatar:
 *           type: string
 *           format: uri
 *         coverImage:
 *           type: string
 *           format: uri
 *         website:
 *           type: string
 *           format: uri
 *         accentColor:
 *           type: string
 *           example: "#3B82F6"
 *         themeId:
 *           type: string
 *           format: uuid
 *
 */