# practic on SARAHA Backend - Secure & Scalable Anonymous Messaging API

Welcome to the backend repository of **SARAHA**, a high-performance, secure, and production-ready anonymous messaging platform. This backend is engineered with a focus on robust security, token-based session management, optimized caching, and strictly validated architectures.

---

##  Tech Stack & Key Integrations
* **Runtime Environment:** Node.js
* **Framework:** Express.js
* **Database & Caching:** Redis (Session caching, Rate-limiting)
* **Security & Network:** Helmet, CORS Policy
* **File Processing:** Multer

---

##  Advanced Authentication & Token Management

The system implements a hardened multi-tier token mechanism to ensure maximum user data privacy and session control.

### 🔑 Token Architecture
* **Access Tokens (JWT):** Short-lived tokens for authenticating standard API requests.
* **Refresh Tokens:** Long-lived tokens securely stored to issue new Access Tokens without prompting user re-login.

###  Token Revocation & Multi-Device Control
* **Logout From Specific Device:** Invalidates a single session by targeting and revoking its specific `refresh token`.
* **Logout From All Devices:** Revokes all active user sessions globally, instantly invalidating every issued refresh token associated with the user account across all browsers and devices.

---

## 🚦 Custom Middlewares Pipeline

Every incoming request passes through a meticulously structured middleware pipeline to ensure data integrity and security before hitting the database.

* ** Authentication Middleware:** Intercepts incoming requests, validates the cryptographic signature of the JWT, and verifies user login status.
* ** Authorization (RBAC):** Role-Based Access Control that dynamic gates API endpoints based on user privileges (`User` ➡️ `Seller` ➡️ `Admin`).
* ** Validation Middleware:** Sanitizes and validates client inputs to prevent malicious payloads or invalid data entry.
* ** Secure File Upload:** Built using `Multer` to handle profile picture uploads, featuring a custom **Magic Numbers Middleware** that verifies actual file signatures (myme-types) directly from buffer bytes to block masked malicious scripts.

---

## 🌍 Third-Party Integrations & Reliability

* ** Email Confirmation:** Secure transactional email workflow to verify user identities during signup.
* ** Google OAuth 2.0:** One-click registration and login seamlessly integrated for friction-free user onboarding.
* ** Redis Caching:** Drastically reduces primary database load by caching high-frequency queries and user sessions.
* ** Rate Limiting:** DDOS and brute-force protection mechanism limiting the number of requests a single client can make within a specified timeframe.
* **⛓️ Handle Rollback Operations:** Built-in atomic transaction rollbacks ensuring data consistency. If any operation within a multi-step database process fails, changes are completely rolled back to maintain perfect state integrity.

---
