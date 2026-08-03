/**
 * @openapi
 * /auth/google:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Authenticate with Google
 *     description: Redirects the user to Google's OAuth 2.0 login page.
 *     responses:
 *       302:
 *         description: Redirect to Google authentication page.
 */

/**
 * @openapi
 * /auth/google/callback:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Google OAuth Callback
 *     description: Callback endpoint after successful Google authentication.
 *     responses:
 *       302:
 *         description: Redirects to frontend with authentication cookies.
 */

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Refresh Access Token
 *     description: Generates a new access token using a valid refresh token.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       200:
 *         description: Access token refreshed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Invalid or expired refresh token.
 */

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logout Current Session
 *     description: Logs out the current user by clearing authentication cookies.
 *     responses:
 *       200:
 *         description: Logout successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

/**
 * @openapi
 * /auth/logout-all:
 *   post:
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *     summary: Logout From All Devices
 *     description: Invalidates every active session of the authenticated user.
 *     responses:
 *       200:
 *         description: Logged out from all devices.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized.
 */

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *     summary: Get Current User
 *     description: Returns the currently authenticated user's profile.
 *     responses:
 *       200:
 *         description: Current user fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized.
 */