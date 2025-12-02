# Complete API Documentation v2.0
## Razorpay Integration Backend - Full API Reference

Complete API documentation with all endpoints, payloads, authentication flows, user flows, and admin flows.

---

## 📋 Table of Contents

1. [Base Configuration](#base-configuration)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
   - [Payment APIs](#payment-apis)
   - [Appointment APIs](#appointment-apis)
   - [Admin APIs](#admin-apis)
   - [Contact APIs](#contact-apis)
4. [Complete User Flow](#complete-user-flow)
5. [Complete Admin Flow](#complete-admin-flow)
6. [Testing Guide](#testing-guide)
7. [Error Handling](#error-handling)

---

## Base Configuration

### Base URL
```
Development: http://localhost:5000
Production: https://your-domain.com
```

### Health Check
```bash
GET /health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is running"
}
```

---

## Authentication

### JWT Token Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Token Format
- **Type:** JWT (JSON Web Token)
- **Expiration:** 7 days
- **Header Format:** `Bearer <token>`

### Getting a Token

1. **Admin Login:**
   ```bash
   POST /api/admin/login
   ```
   Returns a JWT token in the response.

2. **Admin Registration:**
   ```bash
   POST /api/admin/register
   ```
   Returns a JWT token for the newly created admin.

---

## API Endpoints

### Payment APIs

#### 1. Create Payment Order (Legacy)

**Endpoint:** `POST /create-order`

**Description:** Creates a Razorpay order for payment processing.

**Authentication:** ❌ Not Required

**Request Payload:**
```json
{
  "amount": 1000
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": "order_MjQ3XKzJ8qK8qK",
    "entity": "order",
    "amount": 100000,
    "amount_paid": 0,
    "amount_due": 100000,
    "currency": "INR",
    "receipt": "receipt_1234567890_abc123",
    "status": "created",
    "attempts": 0,
    "created_at": 1633024800
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Valid amount is required"
}
```

---

#### 2. Create Payment Order (New API)

**Endpoint:** `POST /api/payments/create-order`

**Description:** Creates a Razorpay order (new API version).

**Authentication:** ❌ Not Required

**Request Payload:**
```json
{
  "amount": 1000
}
```

**Response:** Same as legacy endpoint above.

---

#### 3. Verify Payment (Legacy)

**Endpoint:** `POST /verify-payment`

**Description:** Verifies the payment signature after successful payment.

**Authentication:** ❌ Not Required

**Request Payload:**
```json
{
  "razorpay_order_id": "order_MjQ3XKzJ8qK8qK",
  "razorpay_payment_id": "pay_MjQ3XKzJ8qK8qK",
  "razorpay_signature": "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/verify-payment \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "order_MjQ3XKzJ8qK8qK",
    "razorpay_payment_id": "pay_MjQ3XKzJ8qK8qK",
    "razorpay_signature": "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "success": true,
    "paymentId": "pay_MjQ3XKzJ8qK8qK"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Payment verification failed"
}
```

---

#### 4. Verify Payment (New API)

**Endpoint:** `POST /api/payments/verify-payment`

**Description:** Verifies the payment signature (new API version).

**Authentication:** ❌ Not Required

**Request Payload:** Same as legacy endpoint above.

**Response:** Same as legacy endpoint above.

---

#### 5. Get Payment Details

**Endpoint:** `GET /api/payments/:id`

**Description:** Retrieves payment details by payment ID.

**Authentication:** ✅ Required (JWT Token)

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/payments/payment-uuid-here \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Payment details retrieved successfully",
  "data": {
    "id": "payment-uuid",
    "razorpayOrderId": "order_MjQ3XKzJ8qK8qK",
    "razorpayPaymentId": "pay_MjQ3XKzJ8qK8qK",
    "amount": 1000,
    "currency": "INR",
    "status": "success",
    "receipt": "receipt_1234567890",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

#### 6. Get All Payments

**Endpoint:** `GET /api/payments`

**Description:** Retrieves all payments with optional filters.

**Authentication:** ✅ Required (JWT Token)

**Query Parameters:**
- `status` (optional): Filter by status (pending, success, failed)
- `limit` (optional): Number of results to return
- `offset` (optional): Number of results to skip

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/payments?status=success&limit=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Payments retrieved successfully",
  "data": [
    {
      "id": "payment-uuid-1",
      "razorpayOrderId": "order_123",
      "amount": 1000,
      "status": "success",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": "payment-uuid-2",
      "razorpayOrderId": "order_456",
      "amount": 2000,
      "status": "pending",
      "createdAt": "2024-01-15T11:30:00.000Z"
    }
  ]
}
```

---

### Appointment APIs

#### 1. Create Appointment

**Endpoint:** `POST /api/appointments`

**Description:** Creates a new appointment. **Public endpoint** - anyone can book without authentication.

**Authentication:** ❌ Not Required

**Request Payload:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "date": "2024-02-15",
  "time": "10:00 AM",
  "service": "Consultation",
  "notes": "First time appointment",
  "paymentId": "payment-uuid-optional"
}
```

**Field Descriptions:**
- `name` (required): Full name of the person booking
- `email` (required): Email address
- `phone` (optional): Phone number with country code
- `date` (required): Date in YYYY-MM-DD format
- `time` (required): Time in 12-hour format (e.g., "10:00 AM") or 24-hour format (e.g., "14:30")
- `service` (optional): Type of service requested
- `notes` (optional): Additional notes or requirements
- `paymentId` (optional): Link to payment if already made

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "date": "2024-02-15",
    "time": "10:00 AM",
    "service": "Consultation",
    "notes": "First time appointment"
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Appointment created successfully",
  "data": {
    "id": "appointment-uuid",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "date": "2024-02-15T10:00:00.000Z",
    "time": "10:00 AM",
    "service": "Consultation",
    "notes": "First time appointment",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Failed to create appointment: Invalid date format. Please use YYYY-MM-DD format."
}
```

---

#### 2. Get Appointment by ID

**Endpoint:** `GET /api/appointments/:id`

**Description:** Retrieves appointment details by ID.

**Authentication:** ✅ Required (JWT Token)

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/appointments/appointment-uuid \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Appointment retrieved successfully",
  "data": {
    "id": "appointment-uuid",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "date": "2024-02-15T10:00:00.000Z",
    "time": "10:00 AM",
    "service": "Consultation",
    "status": "confirmed",
    "paymentId": "payment-uuid",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

#### 3. Get Appointments by User ID

**Endpoint:** `GET /api/appointments/user/:userId`

**Description:** Retrieves all appointments for a specific user.

**Authentication:** ✅ Required (JWT Token)

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/appointments/user/user-uuid \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Appointments retrieved successfully",
  "data": [
    {
      "id": "appointment-uuid-1",
      "name": "John Doe",
      "date": "2024-02-15T10:00:00.000Z",
      "status": "confirmed"
    },
    {
      "id": "appointment-uuid-2",
      "name": "John Doe",
      "date": "2024-03-20T14:00:00.000Z",
      "status": "pending"
    }
  ]
}
```

---

#### 4. Update Appointment

**Endpoint:** `PUT /api/appointments/:id`

**Description:** Updates an existing appointment.

**Authentication:** ✅ Required (JWT Token)

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Payload:**
```json
{
  "date": "2024-02-20",
  "time": "2:00 PM",
  "status": "confirmed",
  "notes": "Updated notes"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/appointments/appointment-uuid \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed",
    "notes": "Updated notes"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Appointment updated successfully",
  "data": {
    "id": "appointment-uuid",
    "status": "confirmed",
    "notes": "Updated notes",
    "updatedAt": "2024-01-15T11:30:00.000Z"
  }
}
```

---

#### 5. Delete Appointment

**Endpoint:** `DELETE /api/appointments/:id`

**Description:** Deletes an appointment.

**Authentication:** ✅ Required (JWT Token)

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/appointments/appointment-uuid \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Appointment deleted successfully"
}
```

---

#### 6. Get All Appointments

**Endpoint:** `GET /api/appointments`

**Description:** Retrieves all appointments with optional filters.

**Authentication:** ✅ Required (JWT Token)

**Query Parameters:**
- `status` (optional): Filter by status (pending, confirmed, cancelled, completed)
- `date` (optional): Filter by date
- `limit` (optional): Number of results
- `offset` (optional): Number to skip

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/appointments?status=pending&limit=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Appointments retrieved successfully",
  "data": [
    {
      "id": "appointment-uuid-1",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "date": "2024-02-15T10:00:00.000Z",
      "status": "pending"
    }
  ]
}
```

---

### Admin APIs

#### 1. Admin Login

**Endpoint:** `POST /api/admin/login`

**Description:** Authenticates an admin user and returns JWT token.

**Authentication:** ❌ Not Required

**Request Payload:**
```json
{
  "email": "admin@example.com",
  "password": "securePassword123"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "securePassword123"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "admin": {
      "id": "admin-uuid",
      "email": "admin@example.com",
      "name": "Admin User",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluLXV1aWQiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwibmFtZSI6IkFkbWluIFVzZXIiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDUzMjQ4MDAsImV4cCI6MTcwNTkyOTYwMCwiaXNzIjoicmF6b3JwYXktYmFja2VuZCIsInN1YiI6ImFkbWluLXV1aWQifQ.abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Important:** Save the `token` from the response. Use it in the `Authorization` header for all protected endpoints.

---

#### 2. Register New Admin

**Endpoint:** `POST /api/admin/register`

**Description:** Creates a new admin user. Requires existing admin authentication.

**Authentication:** ✅ Required (JWT Token - Admin Only)

**Request Headers:**
```
Authorization: Bearer <existing_admin_jwt_token>
Content-Type: application/json
```

**Request Payload:**
```json
{
  "name": "New Admin User",
  "email": "newadmin@example.com",
  "password": "securePassword123",
  "role": "admin"
}
```

**Field Descriptions:**
- `name` (required): Full name of the admin
- `email` (required): Unique email address
- `password` (required): Password (will be hashed)
- `role` (optional): Defaults to "admin"

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/admin/register \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Admin User",
    "email": "newadmin@example.com",
    "password": "securePassword123"
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Admin created successfully",
  "data": {
    "admin": {
      "id": "admin-uuid-new",
      "email": "newadmin@example.com",
      "name": "New Admin User",
      "role": "admin",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluLXV1aWQtbmV3IiwiZW1haWwiOiJuZXdhZG1pbkBleGFtcGxlLmNvbSIsIm5hbWUiOiJOZXcgQWRtaW4gVXNlciIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwNTMyNDgwMCwiZXhwIjoxNzA1OTI5NjAwLCJpc3MiOiJyYXpvcnBheS1iYWNrZW5kIiwic3ViIjoiYWRtaW4tdXVpZC1uZXcifQ.xyz789abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Admin with this email already exists"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Authentication token required"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Admin access required"
}
```

**Note:** For the first admin, you may need to create it via database seed or bootstrap script since registration requires an existing admin token.

---

#### 3. Get Admin by ID

**Endpoint:** `GET /api/admin/:id`

**Description:** Retrieves admin details by ID.

**Authentication:** ✅ Required (JWT Token - Admin Only)

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/admin/admin-uuid \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Admin retrieved successfully",
  "data": {
    "id": "admin-uuid",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

#### 4. Get All Admins

**Endpoint:** `GET /api/admin`

**Description:** Retrieves all admin users.

**Authentication:** ✅ Required (JWT Token - Admin Only)

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/admin \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Admins retrieved successfully",
  "data": [
    {
      "id": "admin-uuid-1",
      "name": "Admin User 1",
      "email": "admin1@example.com",
      "role": "admin"
    },
    {
      "id": "admin-uuid-2",
      "name": "Admin User 2",
      "email": "admin2@example.com",
      "role": "admin"
    }
  ]
}
```

---

### Contact APIs

#### 1. Create Contact Inquiry

**Endpoint:** `POST /api/contact`

**Description:** Creates a new contact inquiry. **Public endpoint** - no authentication required.

**Authentication:** ❌ Not Required

**Request Payload:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "subject": "General Inquiry",
  "message": "I would like to know more about your services."
}
```

**Field Descriptions:**
- `name` (required): Full name
- `email` (required): Email address
- `phone` (optional): Phone number
- `subject` (optional): Inquiry subject
- `message` (required): Inquiry message

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "subject": "General Inquiry",
    "message": "I would like to know more about your services."
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Contact inquiry submitted successfully",
  "data": {
    "id": "contact-uuid",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "subject": "General Inquiry",
    "message": "I would like to know more about your services.",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

#### 2. Get Contact by ID

**Endpoint:** `GET /api/contact/:id`

**Description:** Retrieves contact inquiry details (Admin only).

**Authentication:** ✅ Required (JWT Token - Admin Only)

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/contact/contact-uuid \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Contact inquiry retrieved successfully",
  "data": {
    "id": "contact-uuid",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "subject": "General Inquiry",
    "message": "I would like to know more about your services.",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

#### 3. Update Contact Status

**Endpoint:** `PUT /api/contact/:id/status`

**Description:** Updates the status of a contact inquiry (Admin only).

**Authentication:** ✅ Required (JWT Token - Admin Only)

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Payload:**
```json
{
  "status": "responded"
}
```

**Valid Status Values:**
- `pending` - Initial status
- `responded` - Admin has responded
- `resolved` - Issue resolved

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/contact/contact-uuid/status \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "status": "responded"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Contact status updated successfully",
  "data": {
    "id": "contact-uuid",
    "status": "responded",
    "updatedAt": "2024-01-15T11:30:00.000Z"
  }
}
```

---

#### 4. Get All Contact Inquiries

**Endpoint:** `GET /api/contact`

**Description:** Retrieves all contact inquiries (Admin only).

**Authentication:** ✅ Required (JWT Token - Admin Only)

**Query Parameters:**
- `status` (optional): Filter by status (pending, responded, resolved)
- `limit` (optional): Number of results
- `offset` (optional): Number to skip

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/contact?status=pending" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Contact inquiries retrieved successfully",
  "data": [
    {
      "id": "contact-uuid-1",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "subject": "General Inquiry",
      "status": "pending"
    }
  ]
}
```

---

#### 5. Delete Contact Inquiry

**Endpoint:** `DELETE /api/contact/:id`

**Description:** Deletes a contact inquiry (Admin only).

**Authentication:** ✅ Required (JWT Token - Admin Only)

**Request Headers:**
```
Authorization: Bearer <jwt_token>
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/contact/contact-uuid \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Contact inquiry deleted successfully"
}
```

---

## Complete User Flow

### End-to-End User Journey

#### Step-by-Step User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPLETE USER FLOW                           │
└─────────────────────────────────────────────────────────────────┘

1. USER BOOKS APPOINTMENT
   ┌─────────────────────────────────────────┐
   │ POST /api/appointments                  │
   │ (No authentication required)            │
   │                                         │
   │ Payload:                                │
   │ {                                       │
   │   "name": "John Doe",                   │
   │   "email": "john@example.com",         │
   │   "phone": "+1234567890",              │
   │   "date": "2024-02-15",                │
   │   "time": "10:00 AM",                  │
   │   "service": "Consultation"             │
   │ }                                       │
   └─────────────────────────────────────────┘
   ↓
   Response: Appointment created (status: pending)
   ↓

2. USER INITIATES PAYMENT
   ┌─────────────────────────────────────────┐
   │ POST /create-order                      │
   │ (No authentication required)            │
   │                                         │
   │ Payload:                                │
   │ {                                       │
   │   "amount": 1000                        │
   │ }                                       │
   └─────────────────────────────────────────┘
   ↓
   Response: Razorpay order created
   ↓

3. USER COMPLETES PAYMENT ON RAZORPAY
   ┌─────────────────────────────────────────┐
   │ User redirected to Razorpay             │
   │ Payment gateway                         │
   │ User enters payment details             │
   │ Payment processed by Razorpay           │
   └─────────────────────────────────────────┘
   ↓
   Razorpay redirects back with payment data
   ↓

4. USER VERIFIES PAYMENT
   ┌─────────────────────────────────────────┐
   │ POST /verify-payment                    │
   │ (No authentication required)            │
   │                                         │
   │ Payload:                                │
   │ {                                       │
   │   "razorpay_order_id": "order_xxx",    │
   │   "razorpay_payment_id": "pay_xxx",    │
   │   "razorpay_signature": "sig_xxx"      │
   │ }                                       │
   └─────────────────────────────────────────┘
   ↓
   Response: Payment verified successfully
   ↓

5. (Optional) USER CONTACTS SUPPORT
   ┌─────────────────────────────────────────┐
   │ POST /api/contact                       │
   │ (No authentication required)            │
   │                                         │
   │ Payload:                                │
   │ {                                       │
   │   "name": "John Doe",                   │
   │   "email": "john@example.com",         │
   │   "message": "Question about..."       │
   │ }                                       │
   └─────────────────────────────────────────┘
   ↓
   Response: Contact inquiry submitted
```

### User Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                      USER FLOW DIAGRAM                        │
└──────────────────────────────────────────────────────────────┘

    [User Visits Website]
            │
            ▼
    [Browse Services]
            │
            ▼
    ┌───────────────────┐
    │ Book Appointment  │  POST /api/appointments
    │ (No Auth)         │  { name, email, date, time }
    └───────────────────┘
            │
            ▼
    [Appointment Created]
    Status: pending
            │
            ▼
    ┌───────────────────┐
    │ Create Order      │  POST /create-order
    │ (No Auth)         │  { amount: 1000 }
    └───────────────────┘
            │
            ▼
    [Razorpay Order Created]
            │
            ▼
    ┌───────────────────┐
    │ Redirect to       │
    │ Razorpay Gateway  │
    └───────────────────┘
            │
            ▼
    [User Enters Payment]
            │
            ▼
    [Payment Processed]
            │
            ▼
    ┌───────────────────┐
    │ Verify Payment    │  POST /verify-payment
    │ (No Auth)         │  { order_id, payment_id, signature }
    └───────────────────┘
            │
            ▼
    [Payment Verified]
    [Appointment Status: confirmed]
            │
            ▼
    [Confirmation Email/SMS]
            │
            ▼
    [User Receives Confirmation]
```

### User Flow with Code Examples

#### Complete User Flow Script

```javascript
// Step 1: Book Appointment
const appointmentResponse = await fetch('http://localhost:5000/api/appointments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    date: '2024-02-15',
    time: '10:00 AM',
    service: 'Consultation'
  })
});
const appointment = await appointmentResponse.json();
console.log('Appointment created:', appointment.data.id);

// Step 2: Create Payment Order
const orderResponse = await fetch('http://localhost:5000/create-order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ amount: 1000 })
});
const order = await orderResponse.json();
console.log('Order created:', order.data.id);

// Step 3: User completes payment on Razorpay (frontend integration)
// After payment, Razorpay returns: order_id, payment_id, signature

// Step 4: Verify Payment
const verifyResponse = await fetch('http://localhost:5000/verify-payment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    razorpay_order_id: order.data.id,
    razorpay_payment_id: 'pay_xxx', // From Razorpay
    razorpay_signature: 'sig_xxx'   // From Razorpay
  })
});
const verification = await verifyResponse.json();
console.log('Payment verified:', verification.data.success);
```

---

## Complete Admin Flow

### End-to-End Admin Journey

#### Step-by-Step Admin Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPLETE ADMIN FLOW                          │
└─────────────────────────────────────────────────────────────────┘

1. ADMIN LOGS IN
   ┌─────────────────────────────────────────┐
   │ POST /api/admin/login                   │
   │ (No authentication required)            │
   │                                         │
   │ Payload:                                │
   │ {                                       │
   │   "email": "admin@example.com",        │
   │   "password": "securePassword123"       │
   │ }                                       │
   └─────────────────────────────────────────┘
   ↓
   Response: { admin: {...}, token: "jwt_token" }
   ↓
   Save JWT token for subsequent requests
   ↓

2. ADMIN VIEWS DASHBOARD
   ┌─────────────────────────────────────────┐
   │ GET /api/appointments                   │
   │ Authorization: Bearer <token>           │
   └─────────────────────────────────────────┘
   ↓
   GET /api/payments
   Authorization: Bearer <token>
   ↓
   GET /api/contact
   Authorization: Bearer <token>
   ↓
   View all data in dashboard
   ↓

3. ADMIN MANAGES APPOINTMENTS
   ┌─────────────────────────────────────────┐
   │ GET /api/appointments/:id               │
   │ Authorization: Bearer <token>           │
   └─────────────────────────────────────────┘
   ↓
   View appointment details
   ↓
   ┌─────────────────────────────────────────┐
   │ PUT /api/appointments/:id               │
   │ Authorization: Bearer <token>           │
   │                                         │
   │ Payload:                                │
   │ {                                       │
   │   "status": "confirmed"                 │
   │ }                                       │
   └─────────────────────────────────────────┘
   ↓
   Update appointment status
   ↓

4. ADMIN MANAGES PAYMENTS
   ┌─────────────────────────────────────────┐
   │ GET /api/payments                        │
   │ Authorization: Bearer <token>           │
   │ Query: ?status=success                   │
   └─────────────────────────────────────────┘
   ↓
   View all successful payments
   ↓
   ┌─────────────────────────────────────────┐
   │ GET /api/payments/:id                    │
   │ Authorization: Bearer <token>           │
   └─────────────────────────────────────────┘
   ↓
   View payment details
   ↓

5. ADMIN MANAGES CONTACT INQUIRIES
   ┌─────────────────────────────────────────┐
   │ GET /api/contact                        │
   │ Authorization: Bearer <token>           │
   │ Query: ?status=pending                   │
   └─────────────────────────────────────────┘
   ↓
   View pending inquiries
   ↓
   ┌─────────────────────────────────────────┐
   │ PUT /api/contact/:id/status             │
   │ Authorization: Bearer <token>           │
   │                                         │
   │ Payload:                                │
   │ {                                       │
   │   "status": "responded"                  │
   │ }                                       │
   └─────────────────────────────────────────┘
   ↓
   Update inquiry status
   ↓

6. (Optional) ADMIN CREATES NEW ADMIN
   ┌─────────────────────────────────────────┐
   │ POST /api/admin/register                │
   │ Authorization: Bearer <token>           │
   │                                         │
   │ Payload:                                │
   │ {                                       │
   │   "name": "New Admin",                  │
   │   "email": "newadmin@example.com",     │
   │   "password": "securePassword123"      │
   │ }                                       │
   └─────────────────────────────────────────┘
   ↓
   New admin created with JWT token
```

### Admin Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    ADMIN FLOW DIAGRAM                         │
└──────────────────────────────────────────────────────────────┘

    [Admin Visits Admin Panel]
            │
            ▼
    ┌───────────────────┐
    │ Admin Login       │  POST /api/admin/login
    │ (No Auth)         │  { email, password }
    └───────────────────┘
            │
            ▼
    [JWT Token Received]
    Save token for session
            │
            ▼
    ┌─────────────────────────────────┐
    │ Dashboard View                   │
    │                                  │
    │ GET /api/appointments            │
    │ GET /api/payments                │
    │ GET /api/contact                 │
    │ (All with Bearer token)           │
    └─────────────────────────────────┘
            │
            ▼
    ┌─────────────────────────────────┐
    │ Manage Appointments              │
    │                                  │
    │ GET /api/appointments/:id        │
    │ PUT /api/appointments/:id        │
    │ DELETE /api/appointments/:id     │
    │ (Update status, view details)    │
    └─────────────────────────────────┘
            │
            ▼
    ┌─────────────────────────────────┐
    │ Manage Payments                  │
    │                                  │
    │ GET /api/payments                │
    │ GET /api/payments/:id             │
    │ (View all, filter by status)     │
    └─────────────────────────────────┘
            │
            ▼
    ┌─────────────────────────────────┐
    │ Manage Contact Inquiries         │
    │                                  │
    │ GET /api/contact                 │
    │ PUT /api/contact/:id/status      │
    │ DELETE /api/contact/:id          │
    │ (Respond, update status)         │
    └─────────────────────────────────┘
            │
            ▼
    [Admin Actions Complete]
```

### Admin Flow with Code Examples

#### Complete Admin Flow Script

```javascript
// Step 1: Admin Login
const loginResponse = await fetch('http://localhost:5000/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'securePassword123'
  })
});
const loginData = await loginResponse.json();
const token = loginData.data.token;
console.log('Logged in. Token:', token);

// Step 2: View All Appointments
const appointmentsResponse = await fetch('http://localhost:5000/api/appointments', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const appointments = await appointmentsResponse.json();
console.log('Appointments:', appointments.data);

// Step 3: Update Appointment Status
const updateResponse = await fetch('http://localhost:5000/api/appointments/appointment-id', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    status: 'confirmed'
  })
});
const updated = await updateResponse.json();
console.log('Appointment updated:', updated.data);

// Step 4: View All Payments
const paymentsResponse = await fetch('http://localhost:5000/api/payments?status=success', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const payments = await paymentsResponse.json();
console.log('Payments:', payments.data);

// Step 5: Manage Contact Inquiries
const contactsResponse = await fetch('http://localhost:5000/api/contact?status=pending', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const contacts = await contactsResponse.json();
console.log('Pending contacts:', contacts.data);

// Step 6: Update Contact Status
const contactUpdateResponse = await fetch('http://localhost:5000/api/contact/contact-id/status', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    status: 'responded'
  })
});
const contactUpdated = await contactUpdateResponse.json();
console.log('Contact updated:', contactUpdated.data);
```

---

## Testing Guide

### Postman Collection Setup

1. **Create Environment Variables:**
   ```
   baseUrl: http://localhost:5000
   adminToken: (will be set after login)
   ```

2. **Admin Login Request:**
   - Method: `POST`
   - URL: `{{baseUrl}}/api/admin/login`
   - Body (JSON):
     ```json
     {
       "email": "admin@example.com",
       "password": "securePassword123"
     }
     ```
   - Tests Tab (to save token):
     ```javascript
     if (pm.response.code === 200) {
       const response = pm.response.json();
       pm.environment.set("adminToken", response.data.token);
     }
     ```

3. **Use Token in Requests:**
   - Add Header: `Authorization: Bearer {{adminToken}}`

### Complete Test Sequence

#### 1. Test User Flow (No Authentication)

```bash
# Step 1: Create Appointment
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "date": "2024-02-15",
    "time": "10:00 AM",
    "service": "Test Service"
  }'

# Step 2: Create Payment Order
curl -X POST http://localhost:5000/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000}'

# Step 3: Verify Payment (after Razorpay payment)
curl -X POST http://localhost:5000/verify-payment \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "order_xxx",
    "razorpay_payment_id": "pay_xxx",
    "razorpay_signature": "sig_xxx"
  }'
```

#### 2. Test Admin Flow (With Authentication)

```bash
# Step 1: Admin Login
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "securePassword123"
  }'

# Save the token from response: TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Step 2: Get All Appointments
curl -X GET http://localhost:5000/api/appointments \
  -H "Authorization: Bearer $TOKEN"

# Step 3: Get All Payments
curl -X GET http://localhost:5000/api/payments \
  -H "Authorization: Bearer $TOKEN"

# Step 4: Get All Contacts
curl -X GET http://localhost:5000/api/contact \
  -H "Authorization: Bearer $TOKEN"

# Step 5: Update Appointment
curl -X PUT http://localhost:5000/api/appointments/appointment-id \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "confirmed"}'
```

---

## Error Handling

### HTTP Status Codes

| Status Code | Description |
|------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required or invalid token |
| 403 | Forbidden - Insufficient permissions (not admin) |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

### Common Error Responses

#### 400 Bad Request
```json
{
  "success": false,
  "message": "Valid amount is required"
}
```

#### 401 Unauthorized (No Token)
```json
{
  "success": false,
  "message": "Authentication token required"
}
```

#### 401 Unauthorized (Invalid Token)
```json
{
  "success": false,
  "message": "Invalid token"
}
```

#### 401 Unauthorized (Expired Token)
```json
{
  "success": false,
  "message": "Token has expired"
}
```

#### 401 Unauthorized (Invalid Credentials)
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

#### 403 Forbidden
```json
{
  "success": false,
  "message": "Admin access required"
}
```

#### 404 Not Found
```json
{
  "success": false,
  "message": "Appointment not found"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to create appointment: <error details>"
}
```

---

## Quick Reference

### Public Endpoints (No Authentication)
- `POST /api/appointments` - Book appointment
- `POST /create-order` - Create payment order
- `POST /verify-payment` - Verify payment
- `POST /api/contact` - Submit contact inquiry
- `POST /api/admin/login` - Admin login

### Protected Endpoints (Require JWT Token)
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment
- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get payment by ID
- `GET /api/contact` - Get all contact inquiries (Admin only)
- `GET /api/contact/:id` - Get contact by ID (Admin only)
- `PUT /api/contact/:id/status` - Update contact status (Admin only)
- `DELETE /api/contact/:id` - Delete contact (Admin only)
- `POST /api/admin/register` - Register new admin (Admin only)
- `GET /api/admin` - Get all admins (Admin only)
- `GET /api/admin/:id` - Get admin by ID (Admin only)

---

## Environment Setup

### Required Environment Variables

Create a `.env` file in the Backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_Rmcxri4JBDSGKN
RAZORPAY_KEY_SECRET=0kbHafhKvDHoquU59G38Qn9D

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/razorpay_db?schema=public

# JWT Secret (IMPORTANT: Change in production!)
JWT_SECRET=your-very-secure-secret-key-change-in-production
```

### Installation Steps

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma Client
npx prisma generate

# 3. Run database migrations
npx prisma migrate dev

# 4. Start server
npm start
```

---

## Notes

1. **JWT Token Expiration:** Tokens expire after 7 days. Users need to log in again after expiration.

2. **First Admin:** The `/api/admin/register` endpoint requires an existing admin token. To create the first admin:
   - Use a database seed script
   - Create a bootstrap endpoint
   - Manually insert into database

3. **Date Format:** Appointment dates must be in `YYYY-MM-DD` format (e.g., "2024-02-15").

4. **Time Format:** Appointment times can be in:
   - 12-hour format: "10:00 AM", "2:30 PM"
   - 24-hour format: "10:00", "14:30"

5. **Payment Verification:** Always verify payments server-side using the `/verify-payment` endpoint after Razorpay payment completion.

---

**Last Updated:** January 2024  
**API Version:** 2.0.0  
**JWT Authentication:** ✅ Fully Implemented

