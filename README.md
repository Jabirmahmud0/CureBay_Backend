# CureBay Backend

TypeScript-based Node.js backend for the CureBay healthcare e-commerce platform.

## Features

- **Authentication & Authorization**: JWT-based auth with role management
- **User Management**: Support for users, sellers, and admins
- **Medicine Catalog**: Complete medicine inventory management
- **Order Processing**: Shopping cart and order management
- **Payment Integration**: Stripe payment processing
- **File Upload**: Medicine images and user profiles
- **Database**: MongoDB with Mongoose ODM

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (admin only)
- `PUT /api/users/:id/role` - Update user role (admin only)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Medicines
- `GET /api/medicines` - Get all medicines
- `GET /api/medicines/:id` - Get medicine by ID
- `POST /api/medicines` - Create medicine (seller/admin)
- `PUT /api/medicines/:id` - Update medicine (seller/admin)
- `DELETE /api/medicines/:id` - Delete medicine (seller/admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status

### Payments
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/history` - Get payment history

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/curebay
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
npm start
```

## Database Models

- **User**: User accounts with role-based access
- **Medicine**: Medicine catalog with seller information
- **Category**: Medicine categories
- **Order**: Customer orders with items and payment info
- **Payment**: Payment transaction records

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based authorization
- Input validation and sanitization
- CORS configuration
- Rate limiting (recommended for production)

## File Structure

```
src/
├── controllers/     # Route controllers
├── models/         # Database models
├── routes/         # API routes
├── middleware/     # Custom middleware
├── utils/          # Utility functions
└── index.ts        # Application entry point
```

"# CureBay_Backend" 
