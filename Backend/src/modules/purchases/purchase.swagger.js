/**
 * @openapi
 * /purchases/orders:
 *   post:
 *     tags:
 *       - Purchases
 *     summary: Create Product Purchase Order
 *     description: |
 *       Creates a Razorpay payment order for purchasing a digital product.
 *
 *       Authentication is optional. If the buyer is authenticated, the
 *       authenticated user's ID is associated with the purchase.
 *
 *       The product must:
 *       - Exist
 *       - Have PUBLISHED status
 *       - Have PUBLIC or UNLISTED visibility
 *       - Belong to a creator who allows product sales
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePurchaseRequest'
 *           example:
 *             productId: "8d75f70f-5a75-4a5d-a26b-8d8f6e8dc111"
 *             buyerName: "Jane Doe"
 *             buyerEmail: "jane@example.com"
 *
 *     responses:
 *       201:
 *         description: Purchase order created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/PurchaseOrder'
 *
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *
 *       404:
 *         description: Product is unavailable.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               statusCode: 404
 *               message: "Product is unavailable"
 *               errors: []
 *
 *       502:
 *         description: Unable to create payment order.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               statusCode: 502
 *               message: "Unable to create payment order"
 *               errors: []
 *
 *       503:
 *         description: Payment gateway is not configured.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               statusCode: 503
 *               message: "Payment gateway is not configured"
 *               errors: []
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @openapi
 * /purchases/verify:
 *   post:
 *     tags:
 *       - Purchases
 *     summary: Verify Product Purchase Payment
 *     description: |
 *       Verifies a Razorpay payment for a digital product purchase.
 *
 *       After successful verification:
 *       - The payment is marked as successful.
 *       - A purchase record is created.
 *       - The creator's sales and revenue analytics are updated.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyPurchaseRequest'
 *           example:
 *             orderId: "order_RzP8example123"
 *             paymentId: "pay_RzP8example123"
 *             signature: "7f8e9d0c1b2a3..."
 *
 *     responses:
 *       201:
 *         description: Purchase verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Purchase'
 *
 *       400:
 *         description: Invalid payment signature or payment type.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               invalidSignature:
 *                 summary: Invalid payment signature
 *                 value:
 *                   success: false
 *                   statusCode: 400
 *                   message: "Invalid payment signature"
 *                   errors: []
 *               invalidProductPayment:
 *                 summary: Invalid product payment
 *                 value:
 *                   success: false
 *                   statusCode: 400
 *                   message: "Invalid product payment"
 *                   errors: []
 *
 *       404:
 *         description: Payment order or product not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               paymentNotFound:
 *                 summary: Payment order not found
 *                 value:
 *                   success: false
 *                   statusCode: 404
 *                   message: "Payment order not found"
 *                   errors: []
 *               productNotFound:
 *                 summary: Product not found
 *                 value:
 *                   success: false
 *                   statusCode: 404
 *                   message: "Product not found"
 *                   errors: []
 *
 *       409:
 *         description: Payment already belongs to another order.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               statusCode: 409
 *               message: "Payment already belongs to another order"
 *               errors: []
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @openapi
 * /purchases:
 *   get:
 *     tags:
 *       - Purchases
 *     security:
 *       - BearerAuth: []
 *     summary: Get Purchase History
 *     description: |
 *       Returns the authenticated user's digital product purchase history.
 *
 *       Results are ordered by purchase date with the newest purchases first.
 *
 *     responses:
 *       200:
 *         description: Purchase history fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/PurchaseHistoryItem'
 *
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @openapi
 * /purchases/sales:
 *   get:
 *     tags:
 *       - Purchases
 *     security:
 *       - BearerAuth: []
 *     summary: Get Creator Sales
 *     description: |
 *       Returns purchases made for products belonging to the authenticated creator.
 *
 *       Results are ordered by purchase date with the newest sales first.
 *
 *     responses:
 *       200:
 *         description: Creator sales fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/CreatorSale'
 *
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @openapi
 * /purchases/{id}/download:
 *   get:
 *     tags:
 *       - Purchases
 *     security:
 *       - BearerAuth: []
 *     summary: Download Purchased Product
 *     description: |
 *       Downloads the digital product associated with a purchase owned by
 *       the authenticated user.
 *
 *       The purchase must not be expired and must not have exceeded its
 *       download limit.
 *
 *       On success, the endpoint returns the product file as a binary
 *       attachment.
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Purchase ID.
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "8d75f70f-5a75-4a5d-a26b-8d8f6e8dc111"
 *
 *     responses:
 *       200:
 *         description: Product file downloaded successfully.
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *       403:
 *         description: Download is not permitted.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               expired:
 *                 summary: Purchase expired
 *                 value:
 *                   success: false
 *                   statusCode: 403
 *                   message: "Purchase has expired"
 *                   errors: []
 *               limitExceeded:
 *                 summary: Download limit exceeded
 *                 value:
 *                   success: false
 *                   statusCode: 403
 *                   message: "Download limit exceeded"
 *                   errors: []
 *
 *       404:
 *         description: Purchase or product file not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               purchaseNotFound:
 *                 summary: Purchase not found
 *                 value:
 *                   success: false
 *                   statusCode: 404
 *                   message: "Purchase not found"
 *                   errors: []
 *               fileNotFound:
 *                 summary: Product file not found
 *                 value:
 *                   success: false
 *                   statusCode: 404
 *                   message: "Product file not found"
 *                   errors: []
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @openapi
 * components:
 *   schemas:
 *
 *     CreatePurchaseRequest:
 *       type: object
 *       required:
 *         - productId
 *       additionalProperties: false
 *       properties:
 *         productId:
 *           type: string
 *           format: uuid
 *           description: ID of the digital product to purchase.
 *           example: "8d75f70f-5a75-4a5d-a26b-8d8f6e8dc111"
 *
 *         buyerName:
 *           type: string
 *           maxLength: 100
 *           description: Optional buyer name.
 *           example: "Jane Doe"
 *
 *         buyerEmail:
 *           type: string
 *           format: email
 *           description: Optional buyer email address.
 *           example: "jane@example.com"
 *
 *     VerifyPurchaseRequest:
 *       type: object
 *       required:
 *         - orderId
 *         - paymentId
 *         - signature
 *       additionalProperties: false
 *       properties:
 *         orderId:
 *           type: string
 *           minLength: 1
 *           description: Razorpay order ID.
 *           example: "order_RzP8example123"
 *
 *         paymentId:
 *           type: string
 *           minLength: 1
 *           description: Razorpay payment ID.
 *           example: "pay_RzP8example123"
 *
 *         signature:
 *           type: string
 *           minLength: 1
 *           description: Razorpay payment signature.
 *           example: "7f8e9d0c1b2a3..."
 *
 *     PurchaseOrder:
 *       type: object
 *       properties:
 *         paymentId:
 *           type: string
 *           format: uuid
 *           description: Internal payment record ID.
 *
 *         orderId:
 *           type: string
 *           description: Razorpay order ID.
 *
 *         amount:
 *           type: integer
 *           description: Amount in the smallest currency unit. For INR, this is paise.
 *           example: 99900
 *
 *         currency:
 *           type: string
 *           example: "INR"
 *
 *         keyId:
 *           type: string
 *           description: Razorpay public key ID used by the frontend.
 *
 *     Purchase:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *
 *         productId:
 *           type: string
 *           format: uuid
 *
 *         paymentId:
 *           type: string
 *           format: uuid
 *
 *         buyerId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *
 *         buyerName:
 *           type: string
 *           nullable: true
 *
 *         buyerEmail:
 *           type: string
 *           format: email
 *           nullable: true
 *
 *         downloadLimit:
 *           type: integer
 *           nullable: true
 *
 *         downloadCount:
 *           type: integer
 *
 *         purchasedAt:
 *           type: string
 *           format: date-time
 *
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *
 *     PurchaseHistoryItem:
 *       allOf:
 *         - $ref: '#/components/schemas/Purchase'
 *         - type: object
 *           properties:
 *             product:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 title:
 *                   type: string
 *                 slug:
 *                   type: string
 *                 thumbnail:
 *                   type: string
 *                   nullable: true
 *
 *     CreatorSale:
 *       allOf:
 *         - $ref: '#/components/schemas/Purchase'
 *         - type: object
 *           properties:
 *             product:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 title:
 *                   type: string
 *                 slug:
 *                   type: string
 *                 price:
 *                   type: number
 *                   format: double
 *                 thumbnail:
 *                   type: string
 *                   nullable: true
 *
 *             payment:
 *               type: object
 *               properties:
 *                 amount:
 *                   type: number
 *                   format: double
 *                 currency:
 *                   type: string
 *                   example: "INR"
 *                 paymentStatus:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 */