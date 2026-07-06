# API Specification — Module 1: Auth & User Management

This document details the database models, API endpoints, request payloads, response payloads, and tracking statuses for the complete **User Authentication & Session** module.

## Database setup: mongodb+srv://realhoms:<db_password>@realhoms.wkegp0x.mongodb.net/?appName=realhoms

## Resend Setup: 
api key: re_key
example code: import { Resend } from 'resend';

const resend = new Resend('re_key');

resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'minhazmithu4@gmail.com',
  subject: 'Hello World',
  html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
});

## .env file values added.  

## Database Schema (MongoDB / Mongoose)

### `User` Model
```typescript
import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // Hashed using bcrypt
  role: { 
    type: String, 
    enum: ['auth_user', 'agent', 'admin', 'super_admin'], 
    default: 'auth_user' 
  },
  avatar: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationTokenExpires: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordTokenExpires: { type: Date },
  savedProperties: [{ type: Schema.Types.ObjectId, ref: 'Property' }],
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
```

---

## API Endpoints & Statuses

| Action | Method & Route | Status |
| :--- | :--- | :--- |
| **0. Database / Schema Design** | Define User Schema & Indexes | `done` |
| **1. Register User** | `POST /api/auth/register` | `done` |
| **2. Email Verification (Resend)** | `GET /api/auth/verify-email` | `done` |
| **3. Forgot Password Request** | `POST /api/auth/forgot-password` | `done` |
| **4. Reset Password Action** | `POST /api/auth/reset-password` | `done` |
| **5. Login** | `POST /api/auth/login` | `done` |
| **6. Get Current User** | `GET /api/auth/me` | `done` |
| **7. Logout** | `POST /api/auth/logout` | `done` |
| **8. Middleware Route Guard** | `middleware.ts` — server-side | `done` |

---

## API Endpoint Specifications

### 1. Register User
Create a new user account on the platform. Defaults to `auth_user` role, or triggers agent registration if requested. Sends email verification token using Resend.

* **Method / Route**: `POST /api/auth/register`
* **Auth Guard**: Public / None
* **Request Payload**:
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "Password123!",
    "role": "auth_user"
  }
  ```
* **Success Response (`201 Created`)**:
  ```json
  {
    "status": "success",
    "data": {
      "id": "60d5ec4934d52c1b9c9f225f",
      "name": "John Doe",
      "email": "johndoe@example.com",
      "role": "auth_user",
      "isVerified": false,
      "createdAt": "2026-06-18T00:00:00.000Z"
    },
    "message": "Registration successful. Please check your email to verify your account."
  }
  ```
* **Error Response (`400 Bad Request` / Duplicate Email)**:
  ```json
  {
    "status": "error",
    "error": "EmailAlreadyExists",
    "message": "An account with this email address already exists."
  }
  ```
* **Error Response (`400 Bad Request` / Validation Fail)**:
  ```json
  {
    "status": "error",
    "error": "ValidationError",
    "message": "Password must be at least 8 characters long and contain a number.",
    "details": {
      "password": "Too short"
    }
  }
  ```

---

### 2. Email Verification (Resend)
Validates the email verification token sent to the user's inbox and activates their account status.

* **Method / Route**: `GET /api/auth/verify-email`
* **Auth Guard**: Public / None
* **Request Query Parameters**:
  * `token`: The verification token string sent via email.
  * *Example URI*: `/api/auth/verify-email?token=abc123xyz_token_here`
* **Success Response (`200 OK`)**:
  ```json
  {
    "status": "success",
    "message": "Email verified successfully. You can now log in."
  }
  ```
* **Error Response (`400 Bad Request` / Token Expired/Invalid)**:
  ```json
  {
    "status": "error",
    "error": "InvalidOrExpiredToken",
    "message": "The verification token is invalid or has expired."
  }
  ```

---

### 3. Forgot Password Request
Initiates password recovery. Generates a reset token on the user model and sends a recovery email via Resend containing the token reset link.

* **Method / Route**: `POST /api/auth/forgot-password`
* **Auth Guard**: Public / None
* **Request Payload**:
  ```json
  {
    "email": "johndoe@example.com"
  }
  ```
* **Success Response (`200 OK`)**:
  > [!NOTE]
  > To prevent user enumeration attacks, this endpoint returns a success response regardless of whether the email exists.
  ```json
  {
    "status": "success",
    "message": "If that email address exists in our database, we have sent a password reset link."
  }
  ```
* **Error Response (`500 Internal Server Error` / Mailer Failure)**:
  ```json
  {
    "status": "error",
    "error": "EmailDispatchFailed",
    "message": "Unable to send recovery email at this time. Please try again later."
  }
  ```

---

### 4. Reset Password Action
Validates the reset token and applies the new password to the user account.

* **Method / Route**: `POST /api/auth/reset-password`
* **Auth Guard**: Public / None
* **Request Payload**:
  ```json
  {
    "token": "reset_token_from_email_query",
    "password": "NewSecurePassword123!",
    "confirmPassword": "NewSecurePassword123!"
  }
  ```
* **Success Response (`200 OK`)**:
  ```json
  {
    "status": "success",
    "message": "Your password has been reset successfully. You may now log in with your new password."
  }
  ```
* **Error Response (`400 Bad Request` / Passwords Do Not Match)**:
  ```json
  {
    "status": "error",
    "error": "PasswordMismatch",
    "message": "Passwords do not match."
  }
  ```
* **Error Response (`400 Bad Request` / Token Expired/Invalid)**:
  ```json
  {
    "status": "error",
    "error": "InvalidOrExpiredToken",
    "message": "The password reset token is invalid or has expired."
  }
  ```

---

## Session Architecture

- **Mechanism**: JWT stored in an `HttpOnly` `SameSite=Lax` cookie named `be_auth_token`
- **JWT payload**: `{ id, name, email, role, isVerified, iat, exp }`
- **Expiry**: 7 days
- **Secret**: `JWT_SECRET` environment variable (64-byte random base64 string)
- **Secure flag**: enabled in `production`, disabled in `development`

---

### 5. Login

Validates credentials against MongoDB, checks `isVerified`, and issues a signed JWT in an `HttpOnly` cookie.

* **Method / Route**: `POST /api/auth/login`
* **Auth Guard**: Public / None
* **Request Payload**:
  ```json
  {
    "email": "johndoe@example.com",
    "password": "Password123!"
  }
  ```
* **Success Response (`200 OK`)** — also sets `Set-Cookie: be_auth_token=<jwt>; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800`:
  ```json
  {
    "status": "success",
    "data": {
      "id": "60d5ec4934d52c1b9c9f225f",
      "name": "John Doe",
      "email": "johndoe@example.com",
      "role": "auth_user",
      "isVerified": true,
      "avatar": ""
    },
    "message": "Logged in successfully."
  }
  ```
* **Error Response (`400 Bad Request` / Validation)**:
  ```json
  { "status": "error", "error": "ValidationError", "message": "Email and password are required." }
  ```
* **Error Response (`401 Unauthorized` / Wrong credentials)**:
  ```json
  { "status": "error", "error": "InvalidCredentials", "message": "Invalid email or password." }
  ```
* **Error Response (`403 Forbidden` / Email not verified)**:
  ```json
  { "status": "error", "error": "AccountNotVerified", "message": "Please verify your email address before signing in." }
  ```

---

### 6. Get Current User

Reads the `be_auth_token` cookie, verifies the JWT, and returns the latest user data from MongoDB.

* **Method / Route**: `GET /api/auth/me`
* **Auth Guard**: Cookie required
* **Success Response (`200 OK`)**:
  ```json
  {
    "status": "success",
    "data": {
      "id": "60d5ec4934d52c1b9c9f225f",
      "name": "John Doe",
      "email": "johndoe@example.com",
      "role": "auth_user",
      "isVerified": true,
      "avatar": ""
    }
  }
  ```
* **Error Response (`401 Unauthorized` / No or invalid token)**:
  ```json
  { "status": "error", "error": "Unauthorized", "message": "Authentication required." }
  ```

---

### 7. Logout

Clears the `be_auth_token` cookie.

* **Method / Route**: `POST /api/auth/logout`
* **Auth Guard**: None (always succeeds)
* **Success Response (`200 OK`)**:
  ```json
  { "status": "success", "message": "Logged out successfully." }
  ```

---

### 8. Middleware Route Guard

Next.js `middleware.ts` at the project root. Reads and decodes the JWT cookie server-side (no DB call — lightweight decode only).

| Route Pattern | Required Role |
| :--- | :--- |
| `/dashboard*` | Any authenticated user |
| `/agent/*` | `agent`, `admin`, `super_admin` |
| `/admin/*` | `admin`, `super_admin` |
| `/super-admin/*` | `super_admin` |

Redirect on auth failure: `/login?from={pathname}`  
Redirect on role mismatch (authenticated but wrong role): `/dashboard`
