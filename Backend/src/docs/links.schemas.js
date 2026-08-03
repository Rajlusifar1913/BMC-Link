/**
 * @openapi
 * components:
 *   schemas:
 *
 *     Link:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         url:
 *           type: string
 *           format: uri
 *         type:
 *           type: string
 *           enum:
 *             - WEBSITE
 *             - YOUTUBE
 *             - INSTAGRAM
 *             - FACEBOOK
 *             - TWITTER
 *             - GITHUB
 *             - CUSTOM
 *         icon:
 *           type: string
 *           nullable: true
 *         thumbnail:
 *           type: string
 *           format: uri
 *           nullable: true
 *         position:
 *           type: integer
 *         isFeatured:
 *           type: boolean
 *         isActive:
 *           type: boolean
 *         clickCount:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateLinkRequest:
 *       type: object
 *       required:
 *         - url
 *         - type
 *       properties:
 *         title:
 *           type: string
 *         url:
 *           type: string
 *           format: uri
 *         type:
 *           type: string
 *           enum:
 *             - WEBSITE
 *             - YOUTUBE
 *             - INSTAGRAM
 *             - FACEBOOK
 *             - TWITTER
 *             - GITHUB
 *             - CUSTOM
 *         icon:
 *           type: string
 *         thumbnail:
 *           type: string
 *           format: uri
 *         position:
 *           type: integer
 *         isFeatured:
 *           type: boolean
 *         isActive:
 *           type: boolean
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *
 *     UpdateLinkRequest:
 *       allOf:
 *         - $ref: '#/components/schemas/CreateLinkRequest'
 *
 *     ReorderLinksRequest:
 *       type: object
 *       properties:
 *         links:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               position:
 *                 type: integer
 */