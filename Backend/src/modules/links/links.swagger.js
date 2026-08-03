/**
 * @openapi
 * /links:
 *   post:
 *     tags:
 *       - Links
 *     summary: Create Link
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLinkRequest'
 *     responses:
 *       201:
 *         description: Link created successfully
 *
 *   get:
 *     tags:
 *       - Links
 *     summary: Get My Links
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *     responses:
 *       200:
 *         description: Links fetched successfully
 */

/**
 * @openapi
 * /links/{id}:
 *   get:
 *     tags:
 *       - Links
 *     summary: Get Link
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Link fetched successfully
 *
 *   patch:
 *     tags:
 *       - Links
 *     summary: Update Link
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateLinkRequest'
 *     responses:
 *       200:
 *         description: Link updated successfully
 *
 *   delete:
 *     tags:
 *       - Links
 *     summary: Delete Link
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Link deleted successfully
 */

/**
 * @openapi
 * /links/{id}/toggle:
 *   patch:
 *     tags:
 *       - Links
 *     summary: Toggle Link Status
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Link status updated successfully
 */

/**
 * @openapi
 * /links/{id}/duplicate:
 *   post:
 *     tags:
 *       - Links
 *     summary: Duplicate Link
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       201:
 *         description: Link duplicated successfully
 */

/**
 * @openapi
 * /links/reorder:
 *   patch:
 *     tags:
 *       - Links
 *     summary: Reorder Links
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReorderLinksRequest'
 *     responses:
 *       200:
 *         description: Links reordered successfully
 */

/**
 * @openapi
 * /links/public/{username}:
 *   get:
 *     tags:
 *       - Links
 *     summary: Get Public Links
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Public links fetched successfully
 */