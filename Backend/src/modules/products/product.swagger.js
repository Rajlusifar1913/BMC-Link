/**
 * @openapi
 * /products/public/{username}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get Public Products
 *     description: |
 *       Returns published and publicly visible products belonging to a creator.
 *
 *       The creator must have product sales enabled.
 *
 *     parameters:
 *       - $ref: '#/components/parameters/Username'
 *
 *     responses:
 *       200:
 *         description: Public products fetched successfully.
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
 *                         $ref: '#/components/schemas/Product'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @openapi
 * /products/public/{username}/{slug}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get Public Product
 *     description: |
 *       Returns a single published product by creator username and product slug.
 *
 *       Both PUBLIC and UNLISTED products can be accessed through this endpoint.
 *
 *     parameters:
 *       - $ref: '#/components/parameters/Username'
 *
 *       - name: slug
 *         in: path
 *         required: true
 *         description: Unique product slug.
 *         schema:
 *           type: string
 *         example: "my-awesome-course"
 *
 *     responses:
 *       200:
 *         description: Product fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @openapi
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     summary: Get My Products
 *     description: Returns all digital products created by the authenticated creator.
 *
 *     responses:
 *       200:
 *         description: Products fetched successfully.
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
 *                         $ref: '#/components/schemas/Product'
 *
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *
 *   post:
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     summary: Create Product
 *     description: Creates a new digital product for the authenticated creator.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequest'
 *           example:
 *             title: "Backend Development Course"
 *             description: "Complete backend development course."
 *             price: 999
 *             categoryId: "8d75f70f-5a75-4a5d-a26b-8d8f6e8dc111"
 *             tagIds:
 *               - "7d75f70f-5a75-4a5d-a26b-8d8f6e8dc222"
 *             thumbnail: "https://example.com/thumbnail.jpg"
 *             previewUrl: "https://example.com/preview"
 *             visibility: "PUBLIC"
 *             downloadLimit: 5
 *
 *     responses:
 *       201:
 *         description: Product created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *       404:
 *         description: Product category not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               statusCode: 404
 *               message: "Category not found"
 *               errors: []
 *
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @openapi
 * /products/{id}:
 *   patch:
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     summary: Update Product
 *     description: Updates an existing product owned by the authenticated creator.
 *
 *     parameters:
 *       - $ref: '#/components/parameters/ProductId'
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductRequest'
 *
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *       404:
 *         description: Product or category not found.
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
 * /products/{id}/file:
 *   post:
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     summary: Upload Product File
 *     description: |
 *       Uploads the digital product file for a product owned by the
 *       authenticated creator.
 *
 *       The uploaded file is stored and its storage key is assigned to
 *       the product's fileUrl.
 *
 *     parameters:
 *       - $ref: '#/components/parameters/ProductId'
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Digital product file.
 *
 *     responses:
 *       200:
 *         description: Product file uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
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
 * /products/{id}/thumbnail:
 *   post:
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     summary: Upload Product Thumbnail
 *     description: |
 *       Uploads a thumbnail for a product owned by the authenticated creator.
 *
 *     parameters:
 *       - $ref: '#/components/parameters/ProductId'
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - thumbnail
 *             properties:
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: Product thumbnail image.
 *
 *     responses:
 *       200:
 *         description: Product thumbnail uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
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
 * /products/{id}/publish:
 *   post:
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     summary: Publish Product
 *     description: |
 *       Publishes a product owned by the authenticated creator.
 *
 *       A product must have a product file uploaded before it can be published.
 *
 *     parameters:
 *       - $ref: '#/components/parameters/ProductId'
 *
 *     responses:
 *       200:
 *         description: Product published successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *
 *       400:
 *         description: Product file has not been uploaded.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               statusCode: 400
 *               message: "Upload a product file before publishing"
 *               errors: []
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
 * /products/{id}/unpublish:
 *   post:
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     summary: Unpublish Product
 *     description: Changes a published product back to DRAFT status.
 *
 *     parameters:
 *       - $ref: '#/components/parameters/ProductId'
 *
 *     responses:
 *       200:
 *         description: Product unpublished successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
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
 * /products/{id}:
 *   delete:
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     summary: Archive Product
 *     description: |
 *       Archives a product owned by the authenticated creator.
 *
 *       The product is not physically deleted. Its status is changed to ARCHIVED.
 *
 *     parameters:
 *       - $ref: '#/components/parameters/ProductId'
 *
 *     responses:
 *       200:
 *         description: Product archived successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
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
 * components:
 *   schemas:
 *
 *     CreateProductRequest:
 *       type: object
 *       required:
 *         - title
 *         - price
 *       additionalProperties: false
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 150
 *           example: "Backend Development Course"
 *
 *         description:
 *           type: string
 *           maxLength: 5000
 *           nullable: true
 *           example: "Complete backend development course."
 *
 *         price:
 *           type: number
 *           format: double
 *           minimum: 0
 *           maximum: 1000000
 *           example: 999
 *
 *         categoryId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *
 *         tagIds:
 *           type: array
 *           maxItems: 20
 *           items:
 *             type: string
 *             format: uuid
 *
 *         thumbnail:
 *           type: string
 *           format: uri
 *           nullable: true
 *
 *         previewUrl:
 *           type: string
 *           format: uri
 *           nullable: true
 *
 *         visibility:
 *           type: string
 *           enum:
 *             - PUBLIC
 *             - PRIVATE
 *             - UNLISTED
 *           default: PUBLIC
 *
 *         downloadLimit:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *           nullable: true
 *
 *     UpdateProductRequest:
 *       allOf:
 *         - $ref: '#/components/schemas/CreateProductRequest'
 *       description: All product fields are optional when updating a product.
 *
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *
 *         creatorId:
 *           type: string
 *           format: uuid
 *
 *         title:
 *           type: string
 *
 *         description:
 *           type: string
 *           nullable: true
 *
 *         price:
 *           type: number
 *           format: double
 *
 *         fileUrl:
 *           type: string
 *           nullable: true
 *
 *         thumbnail:
 *           type: string
 *           nullable: true
 *
 *         slug:
 *           type: string
 *
 *         categoryId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *
 *         visibility:
 *           type: string
 *           enum:
 *             - PUBLIC
 *             - PRIVATE
 *             - UNLISTED
 *
 *         previewUrl:
 *           type: string
 *           format: uri
 *           nullable: true
 *
 *         downloadLimit:
 *           type: integer
 *           nullable: true
 *
 *         status:
 *           type: string
 *           enum:
 *             - DRAFT
 *             - PUBLISHED
 *             - ARCHIVED
 *
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *         category:
 *           type: object
 *           nullable: true
 *           description: Product category included with the product.
 *
 *         tags:
 *           type: array
 *           description: Product tags included with the product.
 *           items:
 *             type: object
 */