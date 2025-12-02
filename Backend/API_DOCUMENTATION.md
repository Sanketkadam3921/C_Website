# API Documentation & Testing Guide

Complete API documentation with endpoints, payloads, user flows, and admin flows for the Razorpay Integration Backend.

## 📋 Table of Contents

- [Base URL](#base-url)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Payment APIs](#payment-apis)
  - [Appointment APIs](#appointment-apis)
  - [Admin APIs](#admin-apis)
  - [Contact APIs](#contact-apis)
- [User Flow](#user-flow)
- [Admin Flow](#admin-flow)
- [Testing Examples](#testing-examples)
- [Error Responses](#error-responses)

---

## Base URL

```
Development: http://localhost:5000
Production: https://your-domain.com
```

---

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

**Note:** Currently, authentication middleware is in place but JWT implementation is pending. For testing, you may need to temporarily disable authentication or implement JWT tokens.

---

## API Endpoints

### Payment APIs

#### 1. Create Payment Order (Legacy)

**Endpoint:** `POST /create-order`

**Description:** Creates a Razorpay order for payment processing.

**Authentication:** Not required

**Request Body:**

```json
{
  "amount": 1000
}
```

**Request Example (cURL):**

```bash
curl -X POST http://localhost:5000/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000
  }'
```

**Response (Success - 201):**

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

**Response (Error - 400):**

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

**Authentication:** Not required

**Request Body:**

```json
{
  "amount": 1000
}
```

**Response:** Same as legacy endpoint

---

#### 3. Verify Payment (Legacy)

**Endpoint:** `POST /verify-payment`

**Description:** Verifies the payment signature after successful payment.

**Authentication:** Not required

**Request Body:**

```json
{
  "razorpay_order_id": "order_MjQ3XKzJ8qK8qK",
  "razorpay_payment_id": "pay_MjQ3XKzJ8qK8qK",
  "razorpay_signature": "abc123def456..."
}
```

**Request Example (cURL):**

```bash
curl -X POST http://localhost:5000/verify-payment \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "order_MjQ3XKzJ8qK8qK",
    "razorpay_payment_id": "pay_MjQ3XKzJ8qK8qK",
    "razorpay_signature": "abc123def456..."
  }'
```

**Response (Success - 200):**

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

**Response (Error - 400):**

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

**Authentication:** Not required

**Request Body:** Same as legacy endpoint

**Response:** Same as legacy endpoint

---

#### 5. Get Payment Details

**Endpoint:** `GET /api/payments/:id`

**Description:** Retrieves payment details by payment ID.

**Authentication:** Required

**Request Example (cURL):**

```bash
curl -X GET http://localhost:5000/api/payments/payment-uuid-here \
  -H "Authorization: Bearer <token>"
```

**Response (Success - 200):**

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

**Description:** Retrieves all payments (with optional filters).

**Authentication:** Required

**Query Parameters:**

- `status` (optional): Filter by status (pending, success, failed)
- `limit` (optional): Number of results to return
- `offset` (optional): Number of results to skip

**Request Example (cURL):**

```bash
curl -X GET "http://localhost:5000/api/payments?status=success" \
  -H "Authorization: Bearer <token>"
```

**Response (Success - 200):**

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

**Description:** Creates a new appointment. **Public endpoint** - anyone can book an appointment without authentication.

**Authentication:** ❌ Not Required

**Request Body:**

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

**Request Example (cURL):**

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

**Response (Success - 201):**

```json
{
  "success": true,
  "message": "Appointment created successfully",
  "data": {
    "id": "appointment-uuid",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "date": "2024-02-15T00:00:00.000Z",
    "time": "10:00 AM",
    "service": "Consultation",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

#### 2. Get Appointment by ID

**Endpoint:** `GET /api/appointments/:id`

**Description:** Retrieves appointment details by ID.

**Authentication:** Required

**Request Example (cURL):**

```bash
curl -X GET http://localhost:5000/api/appointments/appointment-uuid \
  -H "Authorization: Bearer <token>"
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Appointment retrieved successfully",
  "data": {
    "id": "appointment-uuid",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "date": "2024-02-15T00:00:00.000Z",
    "time": "10:00 AM",
    "service": "Consultation",
    "status": "confirmed",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

#### 3. Get Appointments by User ID

**Endpoint:** `GET /api/appointments/user/:userId`

**Description:** Retrieves all appointments for a specific user.

**Authentication:** Required

**Request Example (cURL):**

```bash
curl -X GET http://localhost:5000/api/appointments/user/user-uuid \
  -H "Authorization: Bearer <token>"
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Appointments retrieved successfully",
  "data": [
    {
      "id": "appointment-uuid-1",
      "name": "John Doe",
      "date": "2024-02-15T00:00:00.000Z",
      "status": "confirmed"
    }
  ]
}
```

---

#### 4. Update Appointment

**Endpoint:** `PUT /api/appointments/:id`

**Description:** Updates an existing appointment.

**Authentication:** Required

**Request Body:**

```json
{
  "date": "2024-02-20",
  "time": "2:00 PM",
  "status": "confirmed",
  "notes": "Updated notes"
}
```

**Request Example (cURL):**

```bash
curl -X PUT http://localhost:5000/api/appointments/appointment-uuid \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "status": "confirmed",
    "notes": "Updated notes"
  }'
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Appointment updated successfully",
  "data": {
    "id": "appointment-uuid",
    "status": "confirmed",
    "updatedAt": "2024-01-15T11:30:00.000Z"
  }
}
```

---

#### 5. Delete Appointment

**Endpoint:** `DELETE /api/appointments/:id`

**Description:** Deletes an appointment.

**Authentication:** Required

**Request Example (cURL):**

```bash
curl -X DELETE http://localhost:5000/api/appointments/appointment-uuid \
  -H "Authorization: Bearer <token>"
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Appointment deleted successfully"
}
```

---

#### 6. Get All Appointments

**Endpoint:** `GET /api/appointments`

**Description:** Retrieves all appointments (with optional filters).

**Authentication:** Required

**Query Parameters:**

- `status` (optional): Filter by status
- `date` (optional): Filter by date
- `limit` (optional): Number of results
- `offset` (optional): Number to skip

**Request Example (cURL):**

```bash
curl -X GET "http://localhost:5000/api/appointments?status=pending" \
  -H "Authorization: Bearer <token>"
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Appointments retrieved successfully",
  "data": [
    {
      "id": "appointment-uuid-1",
      "name": "John Doe",
      "date": "2024-02-15",
      "status": "pending"
    }
  ]
}
```

---

### Admin APIs

#### 1. Register Admin

**Endpoint:** `POST /api/admin/register`

**Description:** Creates a new admin user (requires admin authorization).

**Authentication:** Required (Admin only)

**Request Body:**

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "securePassword123",
  "role": "admin"
}
```

**Request Example (cURL):**

```bash
curl -X POST http://localhost:5000/api/admin/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "securePassword123"
  }'
```

**Response (Success - 201):**

```json
{
  "success": true,
  "message": "Admin created successfully",
  "data": {
    "id": "admin-uuid",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response (Error - 400):**

```json
{
  "success": false,
  "message": "Admin with this email already exists"
}
```

---

#### 2. Admin Login

**Endpoint:** `POST /api/admin/login`

**Description:** Authenticates an admin user and returns token.

**Authentication:** Not required

**Request Body:**

```json
{
  "email": "admin@example.com",
  "password": "securePassword123"
}
```

**Request Example (cURL):**

```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "securePassword123"
  }'
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "admin": {
      "id": "admin-uuid",
      "email": "admin@example.com",
      "name": "Admin User"
    },
    "token": "jwt_token_here"
  }
}
```

**Response (Error - 401):**

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

#### 3. Get Admin by ID

**Endpoint:** `GET /api/admin/:id`

**Description:** Retrieves admin details by ID.

**Authentication:** Required (Admin only)

**Request Example (cURL):**

```bash
curl -X GET http://localhost:5000/api/admin/admin-uuid \
  -H "Authorization: Bearer <admin_token>"
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Admin retrieved successfully",
  "data": {
    "id": "admin-uuid",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

---

#### 4. Get All Admins

**Endpoint:** `GET /api/admin`

**Description:** Retrieves all admin users.

**Authentication:** Required (Admin only)

**Request Example (cURL):**

```bash
curl -X GET http://localhost:5000/api/admin \
  -H "Authorization: Bearer <admin_token>"
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Admins retrieved successfully",
  "data": [
    {
      "id": "admin-uuid-1",
      "name": "Admin User 1",
      "email": "admin1@example.com"
    },
    {
      "id": "admin-uuid-2",
      "name": "Admin User 2",
      "email": "admin2@example.com"
    }
  ]
}
```

---

### Contact APIs

#### 1. Create Contact Inquiry

**Endpoint:** `POST /api/contact`

**Description:** Creates a new contact inquiry (public endpoint).

**Authentication:** Not required

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "subject": "General Inquiry",
  "message": "I would like to know more about your services."
}
```

**Request Example (cURL):**

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

**Response (Success - 201):**

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

**Authentication:** Required (Admin only)

**Request Example (cURL):**

```bash
curl -X GET http://localhost:5000/api/contact/contact-uuid \
  -H "Authorization: Bearer <admin_token>"
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Contact inquiry retrieved successfully",
  "data": {
    "id": "contact-uuid",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "subject": "General Inquiry",
    "status": "pending"
  }
}
```

---

#### 3. Update Contact Status

**Endpoint:** `PUT /api/contact/:id/status`

**Description:** Updates the status of a contact inquiry (Admin only).

**Authentication:** Required (Admin only)

**Request Body:**

```json
{
  "status": "responded"
}
```

**Request Example (cURL):**

```bash
curl -X PUT http://localhost:5000/api/contact/contact-uuid/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "status": "responded"
  }'
```

**Response (Success - 200):**

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

**Valid Status Values:**

- `pending` - Initial status
- `responded` - Admin has responded
- `resolved` - Issue resolved

---

#### 4. Get All Contact Inquiries

**Endpoint:** `GET /api/contact`

**Description:** Retrieves all contact inquiries (Admin only).

**Authentication:** Required (Admin only)

**Query Parameters:**

- `status` (optional): Filter by status
- `limit` (optional): Number of results
- `offset` (optional): Number to skip

**Request Example (cURL):**

```bash
curl -X GET "http://localhost:5000/api/contact?status=pending" \
  -H "Authorization: Bearer <admin_token>"
```

**Response (Success - 200):**

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

**Authentication:** Required (Admin only)

**Request Example (cURL):**

```bash
curl -X DELETE http://localhost:5000/api/contact/contact-uuid \
  -H "Authorization: Bearer <admin_token>"
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Contact inquiry deleted successfully"
}
```

---

## User Flow

### Complete User Journey

#### 1. **Browse Services & Book Appointment**

```
User → POST /api/appointments
  ↓
Appointment Created (status: pending)
  ↓
User receives confirmation
```

#### 2. **Make Payment for Appointment**

```
User → POST /create-order (amount: 1000)
  ↓
Razorpay Order Created
  ↓
User redirected to Razorpay payment page
  ↓
User completes payment
  ↓
Razorpay redirects back with payment details
  ↓
User → POST /verify-payment
  ↓
Payment Verified & Appointment Linked
  ↓
Appointment status updated to "confirmed"
```

#### 3. **View Appointment Details**

```
User → GET /api/appointments/:id
  ↓
Appointment details displayed
```

#### 4. **View All User Appointments**

```
User → GET /api/appointments/user/:userId
  ↓
List of user's appointments displayed
```

#### 5. **Update Appointment (if needed)**

```
User → PUT /api/appointments/:id
  ↓
Appointment updated
```

#### 6. **Contact Support**

```
User → POST /api/contact
  ↓
Contact inquiry submitted
  ↓
User receives confirmation
```

### User Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      USER FLOW                              │
└─────────────────────────────────────────────────────────────┘

1. CREATE APPOINTMENT
   POST /api/appointments
   ↓
2. CREATE PAYMENT ORDER
   POST /create-order
   ↓
3. COMPLETE PAYMENT (Razorpay)
   ↓
4. VERIFY PAYMENT
   POST /verify-payment
   ↓
5. VIEW APPOINTMENT
   GET /api/appointments/:id
   ↓
6. (Optional) UPDATE APPOINTMENT
   PUT /api/appointments/:id
   ↓
7. CONTACT SUPPORT (if needed)
   POST /api/contact
```

---

## Admin Flow

### Complete Admin Journey

#### 1. **Admin Login**

```
Admin → POST /api/admin/login
  ↓
JWT Token Received
  ↓
Token stored for subsequent requests
```

#### 2. **View All Appointments**

```
Admin → GET /api/appointments
  ↓
All appointments listed
  ↓
Admin can filter by status, date, etc.
```

#### 3. **Update Appointment Status**

```
Admin → PUT /api/appointments/:id
  ↓
Appointment status updated
  ↓
User notified (if notification system implemented)
```

#### 4. **View All Payments**

```
Admin → GET /api/payments
  ↓
All payments listed
  ↓
Admin can filter by status
```

#### 5. **View Payment Details**

```
Admin → GET /api/payments/:id
  ↓
Payment details displayed
```

#### 6. **Manage Contact Inquiries**

```
Admin → GET /api/contact
  ↓
All contact inquiries listed
  ↓
Admin → PUT /api/contact/:id/status
  ↓
Status updated (pending → responded → resolved)
```

#### 7. **Register New Admin (Super Admin Only)**

```
Super Admin → POST /api/admin/register
  ↓
New admin created
```

### Admin Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     ADMIN FLOW                              │
└─────────────────────────────────────────────────────────────┘

1. LOGIN
   POST /api/admin/login
   ↓
2. DASHBOARD VIEW
   GET /api/appointments (all)
   GET /api/payments (all)
   GET /api/contact (all)
   ↓
3. MANAGE APPOINTMENTS
   GET /api/appointments/:id
   PUT /api/appointments/:id
   DELETE /api/appointments/:id
   ↓
4. MANAGE PAYMENTS
   GET /api/payments/:id
   GET /api/payments (with filters)
   ↓
5. MANAGE CONTACT INQUIRIES
   GET /api/contact/:id
   PUT /api/contact/:id/status
   DELETE /api/contact/:id
   ↓
6. ADMIN MANAGEMENT (Optional)
   POST /api/admin/register
   GET /api/admin
```

---

## Testing Examples

### Using Postman

#### Collection Setup

1. Create a new Postman collection: "Razorpay API"
2. Set base URL variable: `{{baseUrl}} = http://localhost:5000`
3. Set token variable: `{{token}} = <your_jwt_token>`

#### Environment Variables

```
baseUrl: http://localhost:5000
token: <jwt_token_here>
adminToken: <admin_jwt_token_here>
```

### Using cURL

#### Test Payment Flow

```bash
# 1. Create Order
curl -X POST http://localhost:5000/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000}'

# 2. Verify Payment (after payment completion)
curl -X POST http://localhost:5000/verify-payment \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "order_xxx",
    "razorpay_payment_id": "pay_xxx",
    "razorpay_signature": "signature_xxx"
  }'
```

#### Test Appointment Flow

```bash
# 1. Create Appointment (No authentication required)
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "date": "2024-02-15",
    "time": "10:00 AM",
    "service": "Consultation"
  }'

# 2. Get Appointment (Authentication required)
curl -X GET http://localhost:5000/api/appointments/<appointment_id> \
  -H "Authorization: Bearer <token>"
```

#### Test Admin Flow

```bash
# 1. Admin Login
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'

# 2. Get All Appointments (Admin)
curl -X GET http://localhost:5000/api/appointments \
  -H "Authorization: Bearer <admin_token>"
```

### Using JavaScript (Fetch API)

```javascript
// Create Payment Order
async function createOrder(amount) {
  const response = await fetch("http://localhost:5000/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount }),
  });
  const data = await response.json();
  return data;
}

// Verify Payment
async function verifyPayment(orderId, paymentId, signature) {
  const response = await fetch("http://localhost:5000/verify-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
    }),
  });
  const data = await response.json();
  return data;
}

// Create Appointment (No authentication required)
async function createAppointment(appointmentData) {
  const response = await fetch("http://localhost:5000/api/appointments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(appointmentData),
  });
  const data = await response.json();
  return data;
}
```

### Using Python (Requests)

```python
import requests

BASE_URL = "http://localhost:5000"

# Create Payment Order
def create_order(amount):
    response = requests.post(
        f"{BASE_URL}/create-order",
        json={"amount": amount}
    )
    return response.json()

# Verify Payment
def verify_payment(order_id, payment_id, signature):
    response = requests.post(
        f"{BASE_URL}/verify-payment",
        json={
            "razorpay_order_id": order_id,
            "razorpay_payment_id": payment_id,
            "razorpay_signature": signature
        }
    )
    return response.json()

# Create Appointment (No authentication required)
def create_appointment(appointment_data):
    headers = {
        "Content-Type": "application/json"
    }
    response = requests.post(
        f"{BASE_URL}/api/appointments",
        json=appointment_data,
        headers=headers
    )
    return response.json()
```

---

## Error Responses

### Standard Error Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message description"
}
```

### HTTP Status Codes

| Status Code | Description                                             |
| ----------- | ------------------------------------------------------- |
| 200         | OK - Request successful                                 |
| 201         | Created - Resource created successfully                 |
| 400         | Bad Request - Invalid request data                      |
| 401         | Unauthorized - Authentication required or invalid token |
| 403         | Forbidden - Insufficient permissions                    |
| 404         | Not Found - Resource not found                          |
| 500         | Internal Server Error - Server error                    |

### Common Error Responses

#### 400 Bad Request

```json
{
  "success": false,
  "message": "Valid amount is required"
}
```

#### 401 Unauthorized

```json
{
  "success": false,
  "message": "Authentication token required"
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
  "message": "Failed to create order: <error details>"
}
```

---

## Health Check

**Endpoint:** `GET /health`

**Description:** Check if the server is running.

**Request Example:**

```bash
curl -X GET http://localhost:5000/health
```

**Response:**

```json
{
  "success": true,
  "message": "Server is running"
}
```

---

## Notes

1. **Authentication**: Currently, JWT implementation is pending. Update the `auth.middleware.js` to implement JWT token verification.

2. **Database**: Ensure Prisma is set up and migrations are run before testing:

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

3. **Environment Variables**: Make sure `.env` file is configured with:

   - Razorpay credentials
   - Database URL
   - JWT secret

4. **CORS**: CORS is enabled for all origins. Update in production.

5. **Legacy Endpoints**: The legacy endpoints (`/create-order`, `/verify-payment`) are maintained for backward compatibility.

---

## Testing Checklist

### Payment Flow

- [ ] Create payment order
- [ ] Verify payment with valid signature
- [ ] Verify payment with invalid signature
- [ ] Get payment details
- [ ] Get all payments

### Appointment Flow

- [ ] Create appointment
- [ ] Get appointment by ID
- [ ] Get appointments by user ID
- [ ] Update appointment
- [ ] Delete appointment
- [ ] Get all appointments

### Admin Flow

- [ ] Admin login
- [ ] Register new admin (super admin)
- [ ] Get admin details
- [ ] Get all admins
- [ ] Manage appointments
- [ ] Manage payments
- [ ] Manage contact inquiries

### Contact Flow

- [ ] Create contact inquiry
- [ ] Get contact inquiry (admin)
- [ ] Update contact status (admin)
- [ ] Delete contact inquiry (admin)
- [ ] Get all contact inquiries (admin)

---

**Last Updated:** January 2024
**API Version:** 1.0.0
