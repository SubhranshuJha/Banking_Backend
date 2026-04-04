# Frontend API Docs

This backend runs on:

```txt
http://localhost:8000
```

All routes are prefixed with `/api`.

## Quick Summary

- Auth routes: `/api/auth`
- Account routes: `/api/accounts`
- Transaction routes: `/api/transactions`
- Auth works with either:
  - `HttpOnly` cookie named `token`
  - `Authorization: Bearer <token>` header

## Auth Flow For Frontend

1. Register or login.
2. Save the returned `token` if you want to use bearer auth.
3. For protected routes, send either:
   - the cookie automatically with `credentials: 'include'`
   - or the bearer token in the `Authorization` header

Example bearer header:

```txt
Authorization: Bearer <jwt_token>
```

Example fetch with cookie:

```js
fetch("http://localhost:8000/api/accounts/get", {
  method: "GET",
  credentials: "include",
});
```

Example fetch with bearer token:

```js
fetch("http://localhost:8000/api/accounts/get", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

## Common Notes

- Most success responses include `success: true`.
- Some error responses include `success: false`, but transaction errors are not fully consistent.
- Mongo IDs are returned as strings like `"_id": "..."`.
- Password is not returned in user objects.

---

## 1. Register User

`POST /api/auth/register`

### Request body

```json
{
  "email": "john@example.com",
  "name": "John",
  "password": "secret123"
}
```

### Success response

Status: `201`

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "USER_ID",
    "email": "john@example.com",
    "name": "John",
    "createdAt": "2026-02-15T00:00:00.000Z",
    "updatedAt": "2026-02-15T00:00:00.000Z",
    "__v": 0
  },
  "token": "JWT_TOKEN"
}
```

### Error response

Status: `422`

```json
{
  "success": false,
  "message": "User already exists"
}
```

---

## 2. Login User

`POST /api/auth/login`

### Request body

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

### Success response

Status: `200`

```json
{
  "success": true,
  "message": "User logged in successfully",
  "user": {
    "_id": "USER_ID",
    "email": "john@example.com",
    "name": "John",
    "createdAt": "2026-02-15T00:00:00.000Z",
    "updatedAt": "2026-02-15T00:00:00.000Z",
    "__v": 0
  },
  "token": "JWT_TOKEN"
}
```

### Error responses

Status: `404`

```json
{
  "success": false,
  "message": "User not found"
}
```

Status: `401`

```json
{
  "success": false,
  "message": "Invalid password"
}
```

---

## 3. Logout User

`POST /api/auth/logout`

### Auth required

Yes

### Request body

No body required.

### Success response

Status: `200`

```json
{
  "success": true,
  "message": "User logged out successfully"
}
```

### Error response

Status: `400`

```json
{
  "success": false,
  "message": "No token provided"
}
```

---

## 4. Create Account

`POST /api/accounts/create`

### Auth required

Yes

### Request body

No body required.

### Success response

Status: `201`

```json
{
  "success": true,
  "account": {
    "_id": "ACCOUNT_ID",
    "user": "USER_ID",
    "status": "active",
    "currency": "INR",
    "createdAt": "2026-02-15T00:00:00.000Z",
    "updatedAt": "2026-02-15T00:00:00.000Z",
    "__v": 0
  }
}
```

---

## 5. Get Logged-in User Accounts

`GET /api/accounts/get`

### Auth required

Yes

### Success response

Status: `200`

```json
{
  "success": true,
  "account": [
    {
      "_id": "ACCOUNT_ID",
      "user": "USER_ID",
      "status": "active",
      "currency": "INR",
      "createdAt": "2026-02-15T00:00:00.000Z",
      "updatedAt": "2026-02-15T00:00:00.000Z",
      "__v": 0
    }
  ]
}
```

### Error response

Status: `404`

```json
{
  "success": false,
  "message": "Account not found"
}
```

---

## 6. Get Account Balance

`GET /api/accounts/balance/:accountId`

### Auth required

Yes

### Params

- `accountId`: Mongo account `_id`

Example:

```txt
GET /api/accounts/balance/67b0abcd1234abcd1234abcd
```

### Success response

Status: `200`

```json
{
  "success": true,
  "balance": 5000
}
```

### Error response

Status: `404`

```json
{
  "success": false,
  "message": "Account not found"
}
```

---

## 7. Create Transaction

`POST /api/transactions/create`

### Auth required

Yes

### Request body

```json
{
  "fromAccount": "FROM_ACCOUNT_ID",
  "toAccount": "TO_ACCOUNT_ID",
  "amount": 500,
  "idempotencyKey": "txn-001"
}
```

### Field notes

- `amount` must be greater than `0`
- `idempotencyKey` should be unique per payment attempt
- If the same `idempotencyKey` is sent again, backend returns the already-processed transaction instead of creating a duplicate

### Success response

Status: `201`

```json
{
  "success": true,
  "message": "Transaction completed",
  "tx": {
    "_id": "TRANSACTION_ID",
    "fromAccount": "FROM_ACCOUNT_ID",
    "toAccount": "TO_ACCOUNT_ID",
    "amount": 500,
    "idempotencyKey": "txn-001",
    "status": "completed",
    "createdAt": "2026-02-15T00:00:00.000Z",
    "updatedAt": "2026-02-15T00:00:00.000Z",
    "__v": 0
  }
}
```

### Duplicate idempotency response

Status: `200`

```json
{
  "message": "Already processed",
  "existingTx": {
    "_id": "TRANSACTION_ID",
    "fromAccount": "FROM_ACCOUNT_ID",
    "toAccount": "TO_ACCOUNT_ID",
    "amount": 500,
    "idempotencyKey": "txn-001",
    "status": "completed",
    "createdAt": "2026-02-15T00:00:00.000Z",
    "updatedAt": "2026-02-15T00:00:00.000Z",
    "__v": 0
  }
}
```

### Validation error examples

Status: `400`

```json
{
  "message": "All fields required"
}
```

```json
{
  "message": "Invalid amount"
}
```

### Runtime error examples

Status: `500`

```json
{
  "success": false,
  "message": "Account not found"
}
```

```json
{
  "success": false,
  "message": "Inactive account"
}
```

```json
{
  "success": false,
  "message": "Insufficient balance"
}
```

---

## 8. Add Initial Funds (System Route)

`POST /api/transactions/system-initialFunds`

### Auth required

Yes, and the logged-in user must be a `systemUser`.

### Request body

```json
{
  "toAccountId": "ACCOUNT_ID",
  "amount": 1000,
  "idempotencyKey": "initial-fund-001"
}
```

### Success response

Status: `201`

```json
{
  "success": true,
  "message": "Initial funds added",
  "tx": {
    "_id": "TRANSACTION_ID",
    "fromAccount": "SYSTEM_ACCOUNT_ID",
    "toAccount": "ACCOUNT_ID",
    "amount": 1000,
    "idempotencyKey": "initial-fund-001",
    "status": "completed",
    "createdAt": "2026-02-15T00:00:00.000Z",
    "updatedAt": "2026-02-15T00:00:00.000Z",
    "__v": 0
  }
}
```

### Error response

Status: `400`

```json
{
  "success": false,
  "message": "All fields required"
}
```

Possible messages:

- `All fields required`
- `Invalid amount`
- `Receiver account not found`
- `System account missing`

---

## Frontend Data Shapes

### User

```json
{
  "_id": "USER_ID",
  "email": "john@example.com",
  "name": "John",
  "createdAt": "2026-02-15T00:00:00.000Z",
  "updatedAt": "2026-02-15T00:00:00.000Z",
  "__v": 0
}
```

### Account

```json
{
  "_id": "ACCOUNT_ID",
  "user": "USER_ID",
  "status": "active",
  "currency": "INR",
  "createdAt": "2026-02-15T00:00:00.000Z",
  "updatedAt": "2026-02-15T00:00:00.000Z",
  "__v": 0
}
```

### Transaction

```json
{
  "_id": "TRANSACTION_ID",
  "fromAccount": "FROM_ACCOUNT_ID",
  "toAccount": "TO_ACCOUNT_ID",
  "amount": 500,
  "idempotencyKey": "txn-001",
  "status": "completed",
  "createdAt": "2026-02-15T00:00:00.000Z",
  "updatedAt": "2026-02-15T00:00:00.000Z",
  "__v": 0
}
```

---

## Suggested Frontend Screens

- Register
- Login
- Account creation
- Account list
- Account balance
- Send money / transfer

## Important Integration Notes

- Use `credentials: 'include'` only if your frontend is set up to work with backend cookies.
- If you are not using cookies, use the returned `token` as bearer auth.
- The backend currently does not expose a dedicated "get current user profile" route.
- The account list response key is `account`, not `accounts`.
- Some transaction error responses do not include `success: false`, so frontend error handling should read `message` first.
