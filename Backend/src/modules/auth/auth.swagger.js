/**
 * @openapi
 * /auth/google:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Login with Google
 *     description: |
 *       Starts the Google OAuth 2.0 authentication flow.
 *
 *       The user is redirected to Google's consent screen.
 *
 *       No authentication token is required.
 *
 *     responses:
 *       302:
 *         description: Redirected to Google OAuth consent screen.
 */
/**
 * @openapi
 * /auth/google/callback:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Google OAuth Callback
 *     description: |
 *       Callback endpoint used by Google after successful authentication.
 *
 *       On success:
 *
 *       - Creates or updates the user.
 *       - Creates a session.
 *       - Generates Access Token.
 *       - Generates Refresh Token.
 *       - Stores both tokens as HTTP Only cookies.
 *       - Redirects user to frontend.
 *
 *     responses:
 *       302:
 *         description: Successfully authenticated and redirected.
 *
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Refresh Access Token
 *     description: |
 *       Generates a new access token using a valid refresh token.
 *
 *       Refresh token may be supplied either:
 *
 *       - HTTP Only Cookie
 *       - Request Body
 *
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *
 *     responses:
 *       200:
 *         description: Token refreshed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *
 *       401:
 *         description: Missing, invalid or expired refresh token.
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
 * /auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logout
 *     description: |
 *       Logs out the current session.
 *
 *       Clears access token and refresh token cookies.
 *
 *     responses:
 *       200:
 *         description: Logout successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
/**
 * @openapi
 * /auth/logout-all:
 *   post:
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *
 *     summary: Logout From All Devices
 *
 *     description: |
 *       Deletes every active session belonging to the authenticated user.
 *
 *     responses:
 *       200:
 *         description: Logged out from all devices.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *
 *     summary: Get Current User
 *
 *     description: Returns the authenticated user's information.
 *
 *     responses:
 *       200:
 *         description: User fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
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
