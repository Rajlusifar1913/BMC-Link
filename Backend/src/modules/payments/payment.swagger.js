/**
 * @openapi
 * /payments/create-order:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Create Payment Order
 *     description: |
 *       Creates a Razorpay payment order and stores the corresponding
 *       payment record in the database.
 *
 *       The payment type determines what the payment is being created for.
 *
 *       Supported payment types:
 *       - DONATION
 *       - MEMBERSHIP
 *       - PREMIUM_SUBSCRIPTION
 *       - PRODUCT_PURCHASE
 *
 *       The amount is specified in INR. The Razorpay order amount returned
 *       by this endpoint is represented in the smallest currency unit
 *       (paise).
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePaymentOrderRequest'
 *           example:
 *             userId: "8d75f70f-5a75-4a5d-a26b-8d8f6e8dc111"
 *             paymentType: "PRODUCT_PURCHASE"
 *             amount: 999
 *             metadata:
 *               productId: "7d75f70f-5a75-4a5d-a26b-8d8f6e8dc222"
 *               creatorId: "6d75f70f-5a75-4a5d-a26b-8d8f6e8dc333"
 *
 *     responses:
 *       201:
 *         description: Payment order created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/PaymentOrder'
 *
 *       400:
 *         description: Invalid payment amount or request data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               invalidAmount:
 *                 summary: Invalid amount
 *                 value:
 *                   success: false
 *                   statusCode: 400
 *                   message: "Amount must be greater than zero"
 *                   errors: []
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
 * /payments/verify-checkout:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Verify Razorpay Checkout Payment
 *     description: |
 *       Verifies a Razorpay checkout payment using the Razorpay order ID,
 *       payment ID and payment signature.
 *
 *       On successful verification, the payment is marked as SUCCESSFUL
 *       and the Razorpay payment ID and signature are stored.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyCheckoutRequest'
 *           example:
 *             orderId: "order_RzP8example123"
 *             paymentId: "pay_RzP8example123"
 *             signature: "7f8e9d0c1b2a3..."
 *
 *     responses:
 *       200:
 *         description: Payment verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Payment'
 *
 *       400:
 *         description: Invalid payment signature.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               statusCode: 400
 *               message: "Invalid payment signature"
 *               errors: []
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
 *         description: Payment ID already belongs to another order.
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
 * /payments/razorpay/webhook:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Razorpay Payment Webhook
 *     description: |
 *       Receives and verifies webhook events sent by Razorpay.
 *
 *       The webhook signature is verified using the configured
 *       RAZORPAY_WEBHOOK_SECRET.
 *
 *       Supported payment status updates:
 *       - payment.failed → FAILED
 *       - payment.captured → SUCCESSFUL
 *
 *       Duplicate webhook events are detected using the Razorpay event ID
 *       or a SHA-256 hash of the raw request body.
 *
 *       This endpoint is intended to be called by Razorpay and should not
 *       normally be invoked manually from the frontend.
 *
 *     parameters:
 *       - name: x-razorpay-signature
 *         in: header
 *         required: true
 *         description: Razorpay webhook signature used to verify the raw request body.
 *         schema:
 *           type: string
 *         example: "7f8e9d0c1b2a3..."
 *
 *       - name: x-razorpay-event-id
 *         in: header
 *         required: false
 *         description: Razorpay webhook event ID used for idempotency.
 *         schema:
 *           type: string
 *         example: "evt_RzP8example123"
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *           example:
 *             event: "payment.captured"
 *             payload:
 *               payment:
 *                 entity:
 *                   id: "pay_RzP8example123"
 *                   order_id: "order_RzP8example123"
 *
 *     responses:
 *       200:
 *         description: Webhook received successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/WebhookResult'
 *             examples:
 *               processed:
 *                 summary: New webhook processed
 *                 value:
 *                   statusCode: 200
 *                   success: true
 *                   message: "Webhook received"
 *                   data:
 *                     duplicate: false
 *               duplicate:
 *                 summary: Duplicate webhook
 *                 value:
 *                   statusCode: 200
 *                   success: true
 *                   message: "Webhook received"
 *                   data:
 *                     duplicate: true
 *
 *       400:
 *         description: Invalid webhook signature.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               statusCode: 400
 *               message: "Invalid webhook signature"
 *               errors: []
 *
 *       503:
 *         description: Payment webhook is not configured.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               statusCode: 503
 *               message: "Payment webhook is not configured"
 *               errors: []
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @openapi
 * components:
 *   schemas:
 *
 *     CreatePaymentOrderRequest:
 *       type: object
 *       required:
 *         - paymentType
 *         - amount
 *       additionalProperties: false
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: Optional user ID associated with the payment.
 *           example: "8d75f70f-5a75-4a5d-a26b-8d8f6e8dc111"
 *
 *         paymentType:
 *           type: string
 *           enum:
 *             - DONATION
 *             - MEMBERSHIP
 *             - PREMIUM_SUBSCRIPTION
 *             - PRODUCT_PURCHASE
 *           description: Type of payment being created.
 *           example: "PRODUCT_PURCHASE"
 *
 *         amount:
 *           type: number
 *           format: double
 *           exclusiveMinimum: 0
 *           maximum: 1000000
 *           description: Payment amount in INR.
 *           example: 999
 *
 *         metadata:
 *           type: object
 *           additionalProperties: true
 *           description: Additional payment-specific metadata.
 *           example:
 *             productId: "7d75f70f-5a75-4a5d-a26b-8d8f6e8dc222"
 *
 *     VerifyCheckoutRequest:
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
 *           description: Razorpay checkout signature.
 *           example: "7f8e9d0c1b2a3..."
 *
 *     PaymentOrder:
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
 *           description: Razorpay order amount in the smallest currency unit. For INR, this is paise.
 *           example: 99900
 *
 *         currency:
 *           type: string
 *           example: "INR"
 *
 *         keyId:
 *           type: string
 *           description: Razorpay public key ID used by the client.
 *           example: "rzp_test_xxxxxxxxxx"
 *
 *     Payment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *
 *         userId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *
 *         paymentType:
 *           type: string
 *           enum:
 *             - DONATION
 *             - MEMBERSHIP
 *             - PREMIUM_SUBSCRIPTION
 *             - PRODUCT_PURCHASE
 *
 *         amount:
 *           type: number
 *           format: double
 *
 *         currency:
 *           type: string
 *           example: "INR"
 *
 *         paymentStatus:
 *           type: string
 *
 *         gatewayId:
 *           type: string
 *           format: uuid
 *
 *         gatewayOrderId:
 *           type: string
 *           nullable: true
 *
 *         gatewayPaymentId:
 *           type: string
 *           nullable: true
 *
 *         gatewaySignature:
 *           type: string
 *           nullable: true
 *
 *         metadata:
 *           type: object
 *           nullable: true
 *           additionalProperties: true
 *
 *     WebhookResult:
 *       type: object
 *       required:
 *         - duplicate
 *       properties:
 *         duplicate:
 *           type: boolean
 *           description: Indicates whether the webhook event was already processed.
 *           example: false
 */