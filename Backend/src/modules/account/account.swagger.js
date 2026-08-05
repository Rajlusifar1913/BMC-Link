/**
 * @openapi
 * /account:
 *   get:
 *     tags:
 *       - Account
 *     summary: Get My Profile
 *     description: |
 *       Returns the authenticated user's profile together with creator profile information.
 *
 *       Requires a valid JWT access token.
 *
 *     security:
 *       - BearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Profile fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Profile'
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
 * /account:
 *   patch:
 *     tags:
 *       - Account
 *
 *     summary: Update Profile
 *
 *     description: |
 *       Updates authenticated user's account and creator profile.
 *
 *       Only supplied fields are updated.
 *
 *       Validation Rules:
 *
 *       - name: 2-100 characters
 *       - phone: Valid international phone number
 *       - accentColor: Hex color
 *       - themeId: UUID
 *       - website/profilePicture/avatar/coverImage: Valid URLs
 *
 *     security:
 *       - BearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Profile'
 *
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *       404:
 *         description: Theme or Profile not found.
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
 * /account/check-username/{username}:
 *   get:
 *     tags:
 *       - Account
 *
 *     summary: Check Username Availability
 *
 *     description: |
 *       Checks whether a username is already being used.
 *
 *     parameters:
 *       - $ref: '#/components/parameters/Username'
 *
 *     responses:
 *       200:
 *         description: Username availability checked successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/UsernameAvailability'
 *
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
/**
 * @openapi
 * /account/{username}:
 *   get:
 *     tags:
 *       - Account
 *
 *     summary: Get Public Creator Profile
 *
 *     description: |
 *       Returns the public profile information of a creator.
 *
 *       Authentication is not required.
 *
 *     parameters:
 *       - $ref: '#/components/parameters/Username'
 *
 *     responses:
 *       200:
 *         description: Public profile fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/PublicProfile'
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
