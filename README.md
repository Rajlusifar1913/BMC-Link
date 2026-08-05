# BMC-Link Backend

Backend implementation for the **BuyMeACoffee Link** platform built with **Node.js**, **Express.js**, **Prisma ORM**, and **PostgreSQL**.

The project follows a **feature-based modular architecture** with the **Repository Pattern**, separating Controllers, Services, Repositories, Routes, Validations, and Swagger documentation for maintainability and scalability.

---

# Tech Stack

* Node.js
* Express.js
* PostgreSQL
* Prisma ORM
* Passport.js
* Google OAuth 2.0
* JWT Authentication
* Zod Validation
* Swagger (OpenAPI 3.0)
* Cookie Parser

---

# Project Structure

```text
src
│
├── config/
├── docs/
├── middlewares/
├── modules/
│   ├── auth/
│   ├── account/
│   └── links/
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
repository
routes
validation
swagger
```

---

# Features Implemented

## Authentication Module

* Google OAuth 2.0 Login
* Google OAuth Callback
* JWT Access Token
* JWT Refresh Token
* Refresh Token Rotation
* Session Management
* Logout Current Session
* Logout From All Devices
* Get Current User

---

## Account Module

* Get Logged-in User Profile
* Update Profile
* Check Username Availability
* Get Public Creator Profile

---

## Links Module

* Create Link
* Get Creator Links
* Get Single Link
* Update Link
* Delete Link
* Toggle Link Status
* Duplicate Link
* Reorder Links
* Get Public Links

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

* Request Body
* Query Parameters
* Path Parameters
* Authentication Requirements
* Success Responses
* Error Responses
* Reusable Schemas
* Response Examples

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
PORT=8000

DATABASE_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

FRONTEND_URL=http://localhost:3000
FRONTEND_SUCCESS_URL=http://localhost:3000
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

* Access Token cookie is created.
* Refresh Token cookie is created.
* User session is stored in the database.
* Browser is redirected to the configured frontend URL.

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

* HTTP Only Cookie (recommended)
* Request Body

If valid, a new Access Token and Refresh Token are issued.

---

# Public APIs

These endpoints do not require authentication.

```
GET /account/{username}

GET /links/public/{username}
```

---

# Protected APIs

Authentication Required.

```
GET /auth/me

POST /auth/logout-all

GET /account

PATCH /account

POST /links

GET /links

GET /links/{id}

PATCH /links/{id}

DELETE /links/{id}

PATCH /links/toggle/{id}

POST /links/duplicate/{id}

PATCH /links/reorder
```

---

# Validation

Request validation is implemented using **Zod**.

Validation covers:

* Request Body
* Path Parameters
* Query Parameters

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

* Google OAuth 2.0
* Swagger UI
* Postman
* Prisma Studio
* PostgreSQL

---

# Current Status

Completed

* Authentication Module
* Account Module
* Links Module
* Swagger Documentation
* Request Validation
* JWT Authentication
* Google OAuth Integration

The project is currently ready for review for the implemented modules.
