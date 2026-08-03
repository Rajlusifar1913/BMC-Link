/**
 * @openapi
 * components:
 *   schemas:
 *
 *     ApiResponse:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *           example: 200
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Success
 *         data:
 *           nullable: true
 *
 *     ApiError:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *           example: 400
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *         errors:
 *           type: array
 *           items:
 *               type: object
 */