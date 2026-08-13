/**
 * @openapi
 * /admin/users:
 *   get:
 *     tags:
 *       - Admin
 *
 *     security:
 *       - BearerAuth: []
 *
 *     summary: Get All Users
 *
 *     description: |
 *       Retrieves a paginated list of users for administrative management.
 *
 *       This endpoint is restricted to users with the ADMIN role.
 *
 *       Supports:
 *       - Pagination
 *       - Search by name or email
 *       - Filtering by role
 *       - Filtering by status
 *       - Sorting by createdAt, name, email or lastLogin
 *
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         example: 1
 *
 *       - name: limit
 *         in: query
 *         description: Number of users per page.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         example: 10
 *
 *       - name: search
 *         in: query
 *         description: Search users by name or email.
 *         schema:
 *           type: string
 *         example: john
 *
 *       - name: role
 *         in: query
 *         description: Filter users by role.
 *         schema:
 *           type: string
 *           enum:
 *             - ADMIN
 *             - CREATOR
 *         example: CREATOR
 *
 *       - name: status
 *         in: query
 *         description: Filter users by account status.
 *         schema:
 *           type: string
 *           enum:
 *             - ACTIVE
 *             - SUSPENDED
 *             - DELETED
 *         example: ACTIVE
 *
 *       - name: sortBy
 *         in: query
 *         description: Field used for sorting.
 *         schema:
 *           type: string
 *           enum:
 *             - createdAt
 *             - name
 *             - email
 *             - lastLogin
 *           default: createdAt
 *         example: createdAt
 *
 *       - name: order
 *         in: query
 *         description: Sorting order.
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *           default: desc
 *         example: desc
 *
 *     responses:
 *       200:
 *         description: Users fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         users:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/AdminUser'
 *                         pagination:
 *                           $ref: '#/components/schemas/Pagination'
 *
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */


/**
 * @openapi
 * /admin/users/{id}:
 *   patch:
 *     tags:
 *       - Admin
 *
 *     security:
 *       - BearerAuth: []
 *
 *     summary: Update User
 *
 *     description: |
 *       Updates an existing user's name, role or account status.
 *
 *       This endpoint is restricted to users with the ADMIN role.
 *
 *       At least one of the following fields must be provided:
 *       - name
 *       - role
 *       - status
 *
 *       An administrator cannot modify their own account through this
 *       user management endpoint.
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique ID of the user to update.
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 8d75f70f-5a75-4a5d-a26b-8d8f6e8dc111
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminUpdateUserRequest'
 *           examples:
 *             updateStatus:
 *               summary: Suspend user
 *               value:
 *                 status: SUSPENDED
 *
 *             updateRole:
 *               summary: Change user role
 *               value:
 *                 role: CREATOR
 *
 *             updateName:
 *               summary: Update user name
 *               value:
 *                 name: John Doe
 *
 *             updateMultiple:
 *               summary: Update multiple fields
 *               value:
 *                 name: John Doe
 *                 role: CREATOR
 *                 status: ACTIVE
 *
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/AdminUpdatedUser'
 *
 *       400:
 *         description: Invalid request or administrator attempted to modify their own account.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */


/**
 * @openapi
 * /admin/creators:
 *   get:
 *     tags:
 *       - Admin
 *
 *     security:
 *       - BearerAuth: []
 *
 *     summary: Get All Creators
 *
 *     description: |
 *       Retrieves a paginated list of creator profiles for administrative
 *       management.
 *
 *       This endpoint is restricted to users with the ADMIN role.
 *
 *       Supports:
 *       - Pagination
 *       - Search by username, user name or email
 *       - Filtering by user status
 *       - Sorting by createdAt or username
 *
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         example: 1
 *
 *       - name: limit
 *         in: query
 *         description: Number of creators per page.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         example: 10
 *
 *       - name: search
 *         in: query
 *         description: Search by creator username, user name or email.
 *         schema:
 *           type: string
 *         example: john
 *
 *       - name: status
 *         in: query
 *         description: Filter creators by user account status.
 *         schema:
 *           type: string
 *           enum:
 *             - ACTIVE
 *             - SUSPENDED
 *             - DELETED
 *         example: ACTIVE
 *
 *       - name: sortBy
 *         in: query
 *         description: Field used for sorting.
 *         schema:
 *           type: string
 *           enum:
 *             - createdAt
 *             - username
 *           default: createdAt
 *         example: createdAt
 *
 *       - name: order
 *         in: query
 *         description: Sorting order.
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *           default: desc
 *         example: desc
 *
 *     responses:
 *       200:
 *         description: Creators fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         creators:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/AdminCreator'
 *                         pagination:
 *                           $ref: '#/components/schemas/Pagination'
 *
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */


/**
 * @openapi
 * /admin/reports:
 *   get:
 *     tags:
 *       - Admin
 *
 *     security:
 *       - BearerAuth: []
 *
 *     summary: Get Audit Reports
 *
 *     description: |
 *       Retrieves a paginated list of audit log reports.
 *
 *       This endpoint is restricted to users with the ADMIN role.
 *
 *       Supports:
 *       - Pagination
 *       - Search by action, entity or entity ID
 *       - Filtering by action
 *       - Filtering by entity
 *       - Filtering by user ID
 *       - Filtering by date range
 *       - Sorting by createdAt, action or entity
 *
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         example: 1
 *
 *       - name: limit
 *         in: query
 *         description: Number of reports per page.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         example: 20
 *
 *       - name: search
 *         in: query
 *         description: Search by action, entity or entity ID.
 *         schema:
 *           type: string
 *         example: UPDATE
 *
 *       - name: action
 *         in: query
 *         description: Filter by audit action.
 *         schema:
 *           type: string
 *         example: UPDATE
 *
 *       - name: entity
 *         in: query
 *         description: Filter by entity type.
 *         schema:
 *           type: string
 *         example: User
 *
 *       - name: userId
 *         in: query
 *         description: Filter audit reports by the ID of the user who performed the action.
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 8d75f70f-5a75-4a5d-a26b-8d8f6e8dc111
 *
 *       - name: startDate
 *         in: query
 *         description: Return reports created on or after this date.
 *         schema:
 *           type: string
 *           format: date-time
 *         example: 2026-08-01T00:00:00.000Z
 *
 *       - name: endDate
 *         in: query
 *         description: Return reports created on or before this date.
 *         schema:
 *           type: string
 *           format: date-time
 *         example: 2026-08-12T23:59:59.999Z
 *
 *       - name: sortBy
 *         in: query
 *         description: Field used for sorting.
 *         schema:
 *           type: string
 *           enum:
 *             - createdAt
 *             - action
 *             - entity
 *           default: createdAt
 *         example: createdAt
 *
 *       - name: order
 *         in: query
 *         description: Sorting order.
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *           default: desc
 *         example: desc
 *
 *     responses:
 *       200:
 *         description: Reports fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         reports:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/AdminReport'
 *                         pagination:
 *                           $ref: '#/components/schemas/Pagination'
 *
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */


/**
 * @openapi
 * components:
 *   schemas:
 *
 *     AdminUser:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         profilePicture:
 *           type: string
 *           nullable: true
 *           example: https://example.com/profile.jpg
 *         role:
 *           type: string
 *           enum:
 *             - ADMIN
 *             - CREATOR
 *         status:
 *           type: string
 *           enum:
 *             - ACTIVE
 *             - SUSPENDED
 *             - DELETED
 *         createdAt:
 *           type: string
 *           format: date-time
 *         lastLogin:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         creatorProfile:
 *           type: object
 *           nullable: true
 *           properties:
 *             username:
 *               type: string
 *               example: john_doe
 *
 *     AdminUpdateUserRequest:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         role:
 *           type: string
 *           enum:
 *             - ADMIN
 *             - CREATOR
 *           example: CREATOR
 *         status:
 *           type: string
 *           enum:
 *             - ACTIVE
 *             - SUSPENDED
 *             - DELETED
 *           example: ACTIVE
 *         name:
 *           type: string
 *           minLength: 1
 *           example: John Doe
 *
 *     AdminUpdatedUser:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         role:
 *           type: string
 *           enum:
 *             - ADMIN
 *             - CREATOR
 *         status:
 *           type: string
 *           enum:
 *             - ACTIVE
 *             - SUSPENDED
 *             - DELETED
 *
 *     AdminCreator:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         username:
 *           type: string
 *           example: john_doe
 *         headline:
 *           type: string
 *           nullable: true
 *           example: Full Stack Developer
 *         bio:
 *           type: string
 *           nullable: true
 *           example: Developer building useful products.
 *         avatar:
 *           type: string
 *           nullable: true
 *           example: https://example.com/avatar.jpg
 *         coverImage:
 *           type: string
 *           nullable: true
 *           example: https://example.com/cover.jpg
 *         website:
 *           type: string
 *           nullable: true
 *           example: https://example.com
 *         accentColor:
 *           type: string
 *           nullable: true
 *           example: '#6366F1'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             name:
 *               type: string
 *               example: John Doe
 *             email:
 *               type: string
 *               format: email
 *               example: john@example.com
 *             profilePicture:
 *               type: string
 *               nullable: true
 *             status:
 *               type: string
 *               enum:
 *                 - ACTIVE
 *                 - SUSPENDED
 *                 - DELETED
 *             role:
 *               type: string
 *               enum:
 *                 - ADMIN
 *                 - CREATOR
 *             createdAt:
 *               type: string
 *               format: date-time
 *             lastLogin:
 *               type: string
 *               format: date-time
 *               nullable: true
 *
 *     AdminReport:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         action:
 *           type: string
 *           example: UPDATE
 *         entity:
 *           type: string
 *           example: User
 *         entityId:
 *           type: string
 *           nullable: true
 *           example: 8d75f70f-5a75-4a5d-a26b-8d8f6e8dc111
 *         oldData:
 *           nullable: true
 *           description: Previous state of the affected entity.
 *         newData:
 *           nullable: true
 *           description: New state of the affected entity.
 *         ip:
 *           type: string
 *           nullable: true
 *           example: 127.0.0.1
 *         userAgent:
 *           type: string
 *           nullable: true
 *           example: Mozilla/5.0
 *         createdAt:
 *           type: string
 *           format: date-time
 *         user:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             name:
 *               type: string
 *               example: Admin User
 *             email:
 *               type: string
 *               format: email
 *               example: admin@example.com
 *             role:
 *               type: string
 *               enum:
 *                 - ADMIN
 *                 - CREATOR
 */


/**
 * @openapi
 * tags:
 *   - name: Admin
 *     description: Administrative user, creator and audit report management APIs
 */