# Backend API - Razorpay Integration

A scalable Node.js backend application with Razorpay payment integration, built with Express.js and Prisma ORM.

## 📁 Project Structure

```
backend/
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── src/
│   ├── config/
│   │   ├── env.js
│   │   ├── prisma.js
│   │   └── razorpay.js
│   │
│   ├── routes/
│   │   ├── appointment.routes.js
│   │   ├── payment.routes.js
│   │   ├── admin.routes.js
│   │   └── contact.routes.js
│   │
│   ├── controllers/
│   │   ├── appointment.controller.js
│   │   ├── payment.controller.js
│   │   ├── admin.controller.js
│   │   └── contact.controller.js
│   │
│   ├── services/
│   │   ├── appointment.service.js
│   │   ├── payment.service.js
│   │   ├── admin.service.js
│   │   └── contact.service.js
│   │
│   ├── repositories/
│   │   ├── appointment.repo.js
│   │   ├── payment.repo.js
│   │   ├── admin.repo.js
│   │   └── contact.repo.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validate.middleware.js
│   │
│   ├── utils/
│   │   ├── generateReceipt.js
│   │   ├── response.js
│   │   └── hashPassword.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (or your preferred database)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Install Prisma Client:

```bash
npx prisma generate
```

3. Set up your environment variables:

   - Copy `.env` file and update with your configuration
   - Update `DATABASE_URL` with your database connection string
   - Update Razorpay credentials

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. Start the server:

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

## 📝 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
NODE_ENV=development
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your_jwt_secret_key
```

## 🔌 API Endpoints

### Payment Routes

- `POST /create-order` - Create a Razorpay order (Legacy)
- `POST /verify-payment` - Verify payment signature (Legacy)
- `POST /api/payments/create-order` - Create a Razorpay order
- `POST /api/payments/verify-payment` - Verify payment signature
- `GET /api/payments/:id` - Get payment details
- `GET /api/payments` - Get all payments

### Appointment Routes

- `POST /api/appointments` - Create a new appointment
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `GET /api/appointments/user/:userId` - Get appointments by user ID
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Admin Routes

- `POST /api/admin/register` - Register a new admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin` - Get all admins
- `GET /api/admin/:id` - Get admin by ID

### Contact Routes

- `POST /api/contact` - Create a contact inquiry
- `GET /api/contact` - Get all contact inquiries (Admin only)
- `GET /api/contact/:id` - Get contact inquiry by ID (Admin only)
- `PUT /api/contact/:id/status` - Update contact status (Admin only)
- `DELETE /api/contact/:id` - Delete contact inquiry (Admin only)

## 🏗️ Architecture

This project follows a layered architecture:

1. **Routes** - Define API endpoints and route handlers
2. **Controllers** - Handle HTTP requests and responses
3. **Services** - Contain business logic
4. **Repositories** - Handle database operations
5. **Middlewares** - Handle authentication, validation, and error handling
6. **Utils** - Utility functions and helpers

## 🔒 Security

- Authentication middleware for protected routes
- Admin authorization for admin-only endpoints
- Password hashing using SHA256
- Environment variables for sensitive data

## 📦 Dependencies

- `express` - Web framework
- `razorpay` - Razorpay SDK
- `prisma` - ORM for database operations
- `cors` - CORS middleware
- `body-parser` - Request body parsing
- `dotenv` - Environment variable management

## 🛠️ Development

### Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

### Prisma Studio

View and edit your database data:

```bash
npx prisma studio
```

## 📄 License

ISC
