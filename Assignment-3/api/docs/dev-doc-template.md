# Assignment 3 – Developer Documentation

## 1. Overview

Briefly describe what this API does and the main use case.

- “This API provides authenticated access to mail messages for a corporate mail system.”
- JWT-based authentication
- Role-based access control
- Request logging with unique request IDs
- Rate limiting to prevent abuse
- Centralized error handling
---

## 2. Authentication

### 2.1 Auth Method

- Scheme: Bearer token (JWT)
- Tokens are signed using a server-side secret
- Tokens expire after 1 hour

- How to obtain a token:
  - Endpoint: `POST /auth/login`

  - Request body format:
    ```json
    {
      "username": "user1",
      "password": "user123"
    }
    ```
  - Example success response:
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
    }
    ```
  - Failure (Invalid Credentials):
    ```json
    { 
        "error": "AuthenticationError", 
        "message": "Invalid username or password", "statusCode": 401, 
        "requestId": "abc-123", 
        "timestamp": "2026-01-01T12:00:00Z" 
    }
### 2.2 Using the Token

- Required header for authenticated requests:
  - `Authorization: Bearer <token>`

Mention any expiry behavior (e.g., tokens are valid for 1 hour).

---

## 3. Roles & Access Rules

Describe each role and what it can do.

- `admin`
  - Can view any mail message.
- `user`
  - Can only view their own mail messages.

You can include a simple matrix:

| Endpoint       | Method | admin | user |
|----------------|--------|-------|------|
| `/mail/:id`    | GET    | ✅ allmail | ✅ own mailonly |
| `/auth/login`  | POST   | ✅   | ✅   |
| `/status`      | GET    | ✅   | ✅   |

---

## 4. Endpoints

### 4.1 `POST /auth/login`

**Description:**  
Authenticate user and return JWT.

**Request Body:**

```json
{
  "username": "user1",
  "password": "user123"
}
```

**Success Response (200):**

```json
{
  "token": "..."
}
```

**Errors:**

400 → Missing username/password
401 → Invalid credentials

### 4.2 `GET /mail/:id`

**Description:**
Retrieve a specific mail message.

**Authentication:**

* Requires `Authorization: Bearer <token>` header.

**Access Rules:**

* `admin`: can view any mail.
* `user`: only their own mail.

**Example Request:**

```bash
curl http://localhost:3000/mail/2 \
  -H "Authorization: Bearer <token>"
```

**Example Success Response (200):**

```json
{
  "id": 2,
  "userId": 2,
  "subject": "Hello User1",
  "body": "Your report is ready."
}
```

**Example Forbidden Response (when user tries to access someone else’s mail):**

```json
{
  "error": "Forbidden",
  "message": "Access Denied",
  "statusCode": 403,
  "requestId": "req-12345",
  "timestamp": "2025-11-30T14:22:00Z"
}
```

---

### 4.3 `GET /status`

**Description:**
Simple health check to confirm the API is running.

**Authentication:**

* None required.

**Example Response (200):**

```json
{
  "status": "ok"
}
```

---

## 5. Rate Limiting

Describe how rate limiting works in your implementation.

The API includes a simple in-memory rate limiter.

Configuration
- Maximum requests: RATE_LIMIT_MAX
- Time window: RATE_LIMIT_WINDOW_SECONDS
- Key: IP address (req.ip)
## Behavior

If the request limit is exceeded:
```json
{
  "error": "RateLimitExceeded",
  "message": "Too many requests",
  "statusCode": 429,
  "requestId": "abc-123",
  "timestamp": "2026-01-01T12:00:00Z"
}
```
Clients should wait before retrying.

## 6. Error Response Format

All errors follow a consistent structure:
```json
{
  "error": "ErrorType",
  "message": "Safe explanation",
  "statusCode": 400,
  "requestId": "unique-id",
  "timestamp": "2026-01-01T12:00:00Z"
}
```
## Common Error Types
- BadRequest
- AuthenticationError
- Forbidden
- NotFound
- RateLimitExceeded
- InternalServerError

## 7. Logging & Request IDs

Each request is assigned a unique ID using UUID.

Example log:

- REQUEST 123e4567 GET /mail/1

This requestId is also included in error responses to help trace issues.

## 8. Example Flows

### 8.1 Happy Path: Login + Access Own Mail

# Step 1: Login
```json
curl -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d "{\"username\":\"user1\",\"password\":\"user123\"}"

Response:
{
  "token": "..."
}
```
# Step 2: Access Mail
```json
curl http://localhost:3000/mail/2 \
-H "Authorization: Bearer <token>"
Response:
{
  "id": 2,
  "userId": 2,
  "subject": "Hello User1",
  "body": "Your report is ready."
}
```
### 8.2 Error Path: User Accessing Someone Else’s Mail

Step 1: Login as user1
```json
Step 2: Try accessing another user's mail
curl http://localhost:3000/mail/1 \
-H "Authorization: Bearer <token>"
Response:
{
  "error": "Forbidden",
  "message": "Access denied",
  "statusCode": 403,
  "requestId": "abc-123",
  "timestamp": "2026-01-01T12:00:00Z"
}
```

✅ Summary
- Secure JWT authentication implemented
- RBAC ensures proper access control
- Rate limiting protects API from abuse
- Centralized error handling ensures consistency
- Request logging enables debugging and tracing