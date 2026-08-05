/**
 * @openapi
 * /links:
 *   post:
 *     tags:
 *       - Links
 *     summary: Create Link
 *     description: |
 *       Creates a new link for the authenticated creator.
 *
 *       URL must be unique for the creator.
 *
 *       If position is omitted, the link is automatically placed at the end.
 *
 *     security:
 *       - BearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLinkRequest'
 *
 *     responses:
 *       201:
 *         description: Link created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Link'
 *
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *       409:
 *         description: Link already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
/**
 * @openapi
 * /links:
 *   get:
 *     tags:
 *       - Links
 *
 *     summary: Get Creator Links
 *
 *     description: |
 *       Returns paginated links belonging to the authenticated creator.
 *
 *       Supports:
 *
 *       - Pagination
 *       - Search
 *       - Sorting
 *       - Filtering
 *
 *     security:
 *       - BearerAuth: []
 *
 *     parameters:
 *       - $ref: '#/components/parameters/Page'
 *       - $ref: '#/components/parameters/Limit'
 *       - $ref: '#/components/parameters/Search'
 *       - $ref: '#/components/parameters/Type'
 *       - $ref: '#/components/parameters/IsActive'
 *       - $ref: '#/components/parameters/SortBy'
 *       - $ref: '#/components/parameters/Order'
 *
 *     responses:
 *       200:
 *         description: Links fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/LinkList'
 *
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
/**
 * @openapi
 * /links/{id}:
 *   get:
 *     tags:
 *       - Links
 *
 *     summary: Get Link By ID
 *
 *     description: |
 *       Returns a single link owned by the authenticated creator.
 *
 *     security:
 *       - BearerAuth: []
 *
 *     parameters:
 *       - $ref: '#/components/parameters/LinkId'
 *
 *     responses:
 *       200:
 *         description: Link fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Link'
 *
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
/**
 * @openapi
 * /links/{id}:
 *   patch:
 *     tags:
 *       - Links
 *
 *     summary: Update Link
 *
 *     description: |
 *       Updates an existing link belonging to the authenticated creator.
 *
 *       Only supplied fields are updated.
 *
 *     security:
 *       - BearerAuth: []
 *
 *     parameters:
 *       - $ref: '#/components/parameters/LinkId'
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateLinkRequest'
 *
 *     responses:
 *       200:
 *         description: Link updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Link'
 *
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
/**
 * @openapi
 * /links/{id}:
 *   delete:
 *     tags:
 *       - Links
 *
 *     summary: Delete Link
 *
 *     description: Deletes a creator link permanently.
 *
 *     security:
 *       - BearerAuth: []
 *
 *     parameters:
 *       - $ref: '#/components/parameters/LinkId'
 *
 *     responses:
 *       200:
 *         description: Link deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
/**
 * @openapi
 * /links/toggle/{id}:
 *   patch:
 *     tags:
 *       - Links
 *
 *     summary: Toggle Link Status
 *
 *     description: Enables or disables a creator link.
 *
 *     security:
 *       - BearerAuth: []
 *
 *     parameters:
 *       - $ref: '#/components/parameters/LinkId'
 *
 *     responses:
 *       200:
 *         description: Link status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Link'
 *
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
/**
 * @openapi
 * /links/duplicate/{id}:
 *   post:
 *     tags:
 *       - Links
 *
 *     summary: Duplicate Link
 *
 *     description: Creates a copy of an existing link.
 *
 *     security:
 *       - BearerAuth: []
 *
 *     parameters:
 *       - $ref: '#/components/parameters/LinkId'
 *
 *     responses:
 *       201:
 *         description: Link duplicated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Link'
 *
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
/**
 * @openapi
 * /links/reorder:
 *   patch:
 *     tags:
 *       - Links
 *
 *     summary: Reorder Links
 *
 *     description: |
 *       Updates the display order of creator links.
 *
 *       Every supplied link ID must belong to the authenticated creator.
 *
 *     security:
 *       - BearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReorderLinksRequest'
 *
 *     responses:
 *       200:
 *         description: Links reordered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
/**
 * @openapi
 * /links/public/{username}:
 *   get:
 *     tags:
 *       - Links
 *
 *     summary: Get Public Links
 *
 *     description: |
 *       Returns a creator's public profile along with all active public links.
 *
 *       Authentication is not required.
 *
 *     parameters:
 *       - $ref: '#/components/parameters/Username'
 *
 *     responses:
 *       200:
 *         description: Public links fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */