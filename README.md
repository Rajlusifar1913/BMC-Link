# BMC-Link Backend

Backend implementation for the **BuyMeACoffee Link** platform built with **Node.js**, **Express.js**, **Prisma ORM**, and **PostgreSQL**.

The project follows a **feature-based modular architecture** with the **Repository Pattern**, separating Controllers, Services, Repositories, Routes, Validations, and Swagger documentation for maintainability and scalability.

---

# Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- Passport.js
- Google OAuth 2.0
- JWT Authentication
- Zod Validation
- Swagger (OpenAPI 3.0)
- Cookie Parser

---

# Project Structure

```text
src
│
├── config/
├── docs/
├── middlewares/
├── modules/
│   ├── account/
│   ├── admin/
│   ├── auth/
│   ├── donations/
│   ├── links/
│   ├── media/
│   ├── memberships/
│   ├── payments/
│   ├── products/
│   └── purchases/
│
├── routes/
├── utils/
├── app.js
└── server.js
```

Each module contains:

```text
controller
service
repository (optional)
routes
validation (optional)
swagger (optional)
```

---

# Features Implemented

## Authentication Module

- Google OAuth 2.0 Login
- Google OAuth Callback
- JWT Access Token
- JWT Refresh Token
- Refresh Token Rotation
- Session Management
- Logout Current Session
- Logout From All Devices
- Get Current User

---

## Account & Settings Module

- Get Logged-in User Profile
- Update Profile
- Check Username Availability
- Get Public Creator Profile
- Manage Creator Settings (Allow donations, memberships, products, etc.)
- View Creator Analytics (Profile views, link clicks, total donations, total sales, total revenue)

---

## Links Module

- Create Link
- Get Creator Links
- Get Single Link
- Update Link
- Delete Link
- Toggle Link Status
- Duplicate Link
- Reorder Links
- Get Public Links

---

## Donations Module

- Create Donation Order (Razorpay integration)
- Verify Donation Payment and Signature
- Retrieve Received Donations (Creator dashboard)
- Support Anonymous Donations

---

## Memberships Module

- Create, Update, and List Membership Plans (Creators)
- Retrieve Public Plans for a Creator
- Subscribe to a Membership Plan (Supporters)
- Verify Subscription Payment
- List Active/Past Memberships
- Cancel Membership Subscriptions

---

## Digital Products Module

- Create, Update, and Retrieve Digital Products (Creators)
- Upload Product Files and Thumbnail Images (Local file storage)
- Publish and Unpublish Products
- List Public Products of a Creator
- View Single Public Product Details

---

## Product Purchases Module

- Create Purchase Orders (Supporters)
- Verify Purchase Payments
- Retrieve Sales Analytics & History (Creators)
- Retrieve Purchase History (Buyers)
- Download Purchased Product Files (Authenticated secure downloads)

---

## Payments & Webhooks Module

- Integrated Razorpay Payment Gateway
- Signature & Webhook Verification
- Handle Asynchronous Payment Status Updates (Razorpay Webhook)

---

# Authentication Flow

```text
Client
   │
   ▼
GET /auth/google
   │
   ▼
Google OAuth Login
   │
   ▼
Google Callback
   │
   ▼
Create / Update User
   │
   ▼
Create User Session
   │
   ▼
Generate Access Token
Generate Refresh Token
   │
   ▼
Store Tokens as HTTP-Only Cookies
   │
   ▼
Authenticated APIs
```

---

# API Documentation

Swagger documentation is available for all implemented endpoints.

```
http://localhost:<PORT>/api-docs
```

The documentation includes:

- Request Body
- Query Parameters
- Path Parameters
- Authentication Requirements
- Success Responses
- Error Responses
- Reusable Schemas
- Response Examples

---

# Running the Project

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create a `.env` file in the project root.

Example:

```env
PORT=4800
NODE_ENV="development"
DATABASE_URL="postgresql://postgres:<password>@localhost:5432/<database-name>?schema=public"
CORS_ORIGIN=http://localhost:4800

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:4800/api/v1/auth/google/callback

# JWT & Cryptography
JWT_ACCESS_SECRET=<64-char-string>
JWT_REFRESH_SECRET=<64-char-string>
REFRESH_TOKEN_HASH_SECRET=<64-char-string>

ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d

# Frontend
FRONTEND_URL=http://localhost:5173
FRONTEND_SUCCESS_URL=http://localhost:5173/dashboard

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
```

---

## Generate Prisma Client

```bash
npx prisma generate
```

---

## Apply Database Migration

```bash
npx prisma migrate dev
```

---

## Start Development Server

```bash
npm run dev
```

---

# Authentication Testing

## Browser Login

Open:

```
GET /api/v1/auth/google
```

Authenticate using your Google account.

After successful authentication:

- Access Token cookie is created.
- Refresh Token cookie is created.
- User session is stored in the database.
- Browser is redirected to the configured frontend URL.

---

# Testing Protected APIs

Protected APIs require a valid JWT Access Token.

Swagger cannot perform the Google OAuth flow directly.

To test authenticated APIs using Swagger:

1. Login through Google OAuth.
2. Open Browser Developer Tools.
3. Navigate to **Application → Cookies**.
4. Copy the `accessToken` cookie value.
5. Open Swagger UI.
6. Click **Authorize**.
7. Enter:

```
Bearer <ACCESS_TOKEN>
```

8. Execute protected endpoints.

---

# Refresh Token

If the Access Token expires:

```
POST /auth/refresh
```

The endpoint accepts the Refresh Token from:

- HTTP Only Cookie (recommended)
- Request Body

If valid, a new Access Token and Refresh Token are issued.

---

# Public APIs

These endpoints do not require authentication.

### Account & Links
* `GET /account/check-username/{username}` - Check if a username is available
* `GET /account/{username}` - Get a creator's public profile
* `GET /links/public/{username}` - Get a creator's public links

### Donations
* `POST /donations/orders` - Initiate a donation order
* `POST /donations/verify` - Verify a donation payment signature

### Memberships
* `GET /memberships/public/{username}` - View a creator's public membership plans
* `POST /memberships/subscribe` - Initiate a membership subscription (supports guest checkout)
* `POST /memberships/verify` - Verify a membership subscription payment

### Products & Purchases
* `GET /products/public/{username}` - View public products of a creator
* `GET /products/public/{username}/{slug}` - View details of a specific public product
* `POST /purchases/orders` - Initiate a product purchase order (supports guest checkout)
* `POST /purchases/verify` - Verify a product purchase payment

### Payment Webhooks
* `POST /payments/razorpay/webhook` - Razorpay asynchronous payment events webhook

---

# Protected APIs

Authentication Required.

### Authentication
* `GET /auth/me` - Get current authenticated user details
* `POST /auth/logout-all` - Logout from all devices/sessions

### Account & Settings
* `GET /account` - Get logged-in user profile
* `PATCH /account` - Update user profile details
* `GET /account/settings` - Get creator-specific settings
* `PATCH /account/settings` - Update creator-specific settings
* `GET /account/analytics` - View creator's profile views, link clicks, sales, and donation earnings

### Links
* `POST /links` - Create a new link
* `GET /links` - Retrieve logged-in creator's links
* `GET /links/{id}` - Retrieve details of a specific link
* `PATCH /links/{id}` - Update link details
* `DELETE /links/{id}` - Delete a link
* `PATCH /links/toggle/{id}` - Toggle active/inactive state of a link
* `POST /links/duplicate/{id}` - Duplicate an existing link
* `PATCH /links/reorder` - Reorder links by passing positions

### Donations & Memberships
* `GET /donations/received` - Get list of donations received by the creator
* `GET /memberships/me` - Get logged-in user's active/past membership subscriptions
* `POST /memberships/{id}/cancel` - Cancel an active membership subscription
* `GET /memberships/plans` - View creator's own membership plans
* `POST /memberships/plans` - Create a new membership plan
* `PATCH /memberships/plans/{id}` - Update a membership plan

### Products & Sales
* `GET /products` - View creator's own products list (including drafts)
* `POST /products` - Create a new digital product (creates a DRAFT)
* `PATCH /products/{id}` - Update product details
* `POST /products/{id}/file` - Upload product digital file (multipart/form-data)
* `POST /products/{id}/thumbnail` - Upload product thumbnail image (multipart/form-data)
* `POST /products/{id}/publish` - Publish a product to make it public
* `POST /products/{id}/unpublish` - Revert a product back to DRAFT status
* `DELETE /products/{id}` - Archive (soft-delete) a product
* `GET /purchases/sales` - View creator's product sales analytics and list of sales
* `GET /purchases` - View logged-in buyer's product purchase history
* `GET /purchases/{id}/download` - Download file of a purchased product (validates license & expiry)

---

# Admin APIs

Authentication & ADMIN role required.

* `GET /admin/users` - Retrieve paginated and filtered list of users
* `PATCH /admin/users/{id}` - Update a user's details, role, or status (e.g., suspend/activate)
* `GET /admin/creators` - Retrieve list of creators with validation status
* `GET /admin/reports` - Retrieve platform financial/activity reports

---

# Validation

Request validation is implemented using **Zod**.

Validation covers:

- Request Body
- Path Parameters
- Query Parameters

Invalid requests return standardized API errors.

---

# Response Format

Successful Response

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Error Response

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": []
}
```

---

# Project Architecture

The project follows a layered architecture.

```text
Routes
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Repository
   │
   ▼
Prisma ORM
   │
   ▼
PostgreSQL
```

This separation keeps business logic independent from database operations and improves maintainability.

---

# Tested Using

- Google OAuth 2.0
- Swagger UI
- Postman
- Prisma Studio
- PostgreSQL

---

# Current Status

Completed

- Authentication Module
- Account & Settings Module (including Analytics)
- Links Module
- Donations Module (with Razorpay integration)
- Memberships Module (Subscription flow & plan management)
- Digital Products Module (File/thumbnail upload)
- Purchases Module (Secure buyer downloads)
- Payments Module (Razorpay Webhook)
- Admin Module (User & creator management)
- Swagger Documentation
- Request Validation
- JWT Authentication
- Google OAuth Integration

The project is currently ready for review for all modules.
