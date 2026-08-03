/**
 * @openapi
 * components:
 *   schemas:
 *
 *     CreatorTheme:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *
 *     CreatorProfile:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         headline:
 *           type: string
 *         bio:
 *           type: string
 *         avatar:
 *           type: string
 *           format: uri
 *           nullable: true
 *         coverImage:
 *           type: string
 *           format: uri
 *           nullable: true
 *         website:
 *           type: string
 *           format: uri
 *           nullable: true
 *         accentColor:
 *           type: string
 *         theme:
 *           $ref: '#/components/schemas/CreatorTheme'
 *
 *     Profile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         email:
 *           type: string
 *           format: email
 *         name:
 *           type: string
 *         phone:
 *           type: string
 *           nullable: true
 *         profilePicture:
 *           type: string
 *           format: uri
 *           nullable: true
 *         timezone:
 *           type: string
 *         language:
 *           type: string
 *         creatorProfile:
 *           $ref: '#/components/schemas/CreatorProfile'
 *
 *     PublicProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         username:
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
 *         theme:
 *           $ref: '#/components/schemas/CreatorTheme'
 *         user:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             profilePicture:
 *               type: string
 *               format: uri
 *
 *     UsernameAvailability:
 *       type: object
 *       properties:
 *         available:
 *           type: boolean
 *           example: true
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
 */