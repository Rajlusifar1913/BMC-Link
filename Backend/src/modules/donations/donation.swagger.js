/**
 * @openapi
 * /donations/orders:
 *   post:
 *     tags:
 *       - Donations
 *     summary: Create Donation Order
 *     description: |
 *       Creates a Razorpay payment order for a donation to a creator.
 *
 *       The creator is identified by username. The creator must:
 *       - Exist
 *       - Have an ACTIVE account
 *       - Have donations enabled
 *
 *       This endpoint does not require authentication.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDonationRequest'
 *           example:
 *             username: "john_doe"
 *             amount: 500
 *             name: "Jane Doe"
 *             email: "jane@example.com"
 *             message: "Keep up the great work!"
 *             isAnonymous: false
 *
 *     responses:
 *       201:
 *         description: Donation order created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/DonationOrder'
 *
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *
 *       403:
 *         description: Creator is not accepting donations.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               statusCode: 403
 *               message: "This creator is not accepting donations"
 *               errors: []
 *
 *       404:
 *         description: Creator not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               statusCode: 404
 *               message: "Creator not found"
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
 * /donations/verify:
 *   post:
 *     tags:
 *       - Donations
 *     summary: Verify Donation Payment
 *     description: |
 *       Verifies a Razorpay donation payment using the order ID,
 *       payment ID and payment signature.
 *
 *       After successful verification:
 *       - The payment is marked as SUCCESSFUL.
 *       - A donation record is created.
 *       - Creator donation and revenue analytics are updated.
 *
 *       This endpoint does not require authentication.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyDonationRequest'
 *           example:
 *             orderId: "order_RzP8example123"
 *             paymentId: "pay_RzP8example123"
 *             signature: "7f8e9d0c1b2a3..."
 *
 *     responses:
 *       201:
 *         description: Donation verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Donation'
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
 *               invalidDonation:
 *                 summary: Invalid donation payment
 *                 value:
 *                   success: false
 *                   statusCode: 400
 *                   message: "Invalid donation payment"
 *                   errors: []
 *
 *       404:
 *         description: Payment order not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               statusCode: 404
 *               message: "Payment order not found"
 *               errors: []
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
 * /donations/received:
 *   get:
 *     tags:
 *       - Donations
 *     security:
 *       - BearerAuth: []
 *
 *     summary: Get Received Donations
 *     description: |
 *       Returns all donations received by the authenticated creator.
 *
 *       Donations are returned in descending order by creation date,
 *       with the newest donations first.
 *
 *       Each donation also includes:
 *       - Payment amount
 *       - Payment currency
 *       - Payment status
 *
 *     responses:
 *       200:
 *         description: Donations fetched successfully.
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
 *                         $ref: '#/components/schemas/ReceivedDonation'
 *
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @openapi
 * components:
 *   schemas:
 *
 *     CreateDonationRequest:
 *       type: object
 *       required:
 *         - username
 *         - amount
 *       additionalProperties: false
 *       properties:
 *         username:
 *           type: string
 *           minLength: 3
 *           maxLength: 30
 *           description: Username of the creator receiving the donation.
 *           example: "john_doe"
 *
 *         amount:
 *           type: number
 *           format: double
 *           exclusiveMinimum: 0
 *           maximum: 1000000
 *           description: Donation amount in INR.
 *           example: 500
 *
 *         name:
 *           type: string
 *           maxLength: 100
 *           description: Donor name. Ignored when isAnonymous is true.
 *           example: "Jane Doe"
 *
 *         email:
 *           type: string
 *           format: email
 *           description: Donor email address.
 *           example: "jane@example.com"
 *
 *         message:
 *           type: string
 *           maxLength: 500
 *           description: Optional message from the donor.
 *           example: "Keep up the great work!"
 *
 *         isAnonymous:
 *           type: boolean
 *           default: false
 *           description: Whether the donation should be anonymous.
 *           example: false
 *
 *     VerifyDonationRequest:
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
 *           description: Razorpay order ID returned when creating the donation order.
 *           example: "order_RzP8example123"
 *
 *         paymentId:
 *           type: string
 *           minLength: 1
 *           description: Razorpay payment ID returned after successful payment.
 *           example: "pay_RzP8example123"
 *
 *         signature:
 *           type: string
 *           minLength: 1
 *           description: Razorpay payment signature used for server-side verification.
 *           example: "7f8e9d0c1b2a3..."
 *
 *     DonationOrder:
 *       type: object
 *       properties:
 *         paymentId:
 *           type: string
 *           format: uuid
 *           description: Internal payment record ID.
 *           example: "8d75f70f-5a75-4a5d-a26b-8d8f6e8dc111"
 *
 *         orderId:
 *           type: string
 *           description: Razorpay order ID.
 *           example: "order_RzP8example123"
 *
 *         amount:
 *           type: integer
 *           description: Amount in the smallest currency unit. For INR, this is paise.
 *           example: 50000
 *
 *         currency:
 *           type: string
 *           example: "INR"
 *
 *         keyId:
 *           type: string
 *           description: Razorpay public key ID used by the frontend.
 *           example: "rzp_test_xxxxxxxxxx"
 *
 *     Donation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique donation ID.
 *
 *         creatorId:
 *           type: string
 *           format: uuid
 *           description: ID of the creator who received the donation.
 *
 *         paymentId:
 *           type: string
 *           format: uuid
 *           description: Associated payment ID.
 *
 *         displayName:
 *           type: string
 *           nullable: true
 *           description: Donor display name. Null for anonymous donations.
 *
 *         email:
 *           type: string
 *           format: email
 *           nullable: true
 *
 *         message:
 *           type: string
 *           nullable: true
 *
 *         isAnonymous:
 *           type: boolean
 *
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     ReceivedDonation:
 *       allOf:
 *         - $ref: '#/components/schemas/Donation'
 *         - type: object
 *           properties:
 *             payment:
 *               type: object
 *               properties:
 *                 amount:
 *                   type: number
 *                   format: double
 *                   description: Donation amount in INR.
 *                   example: 500
 *
 *                 currency:
 *                   type: string
 *                   example: "INR"
 *
 *                 paymentStatus:
 *                   type: string
 *                   description: Current payment status.
 *                   example: "SUCCESSFUL"
 */