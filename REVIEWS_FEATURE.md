# Customer Reviews Feature

## Overview
This document describes the implementation of the customer reviews feature for the CureBay application.

## Components

### 1. Frontend Component
- **File**: `frontend/src/components/CustomerReviews.jsx`
- **Features**:
  - Displays customer reviews in a two-column layout
  - Shows review statistics and rating distribution
  - Includes a "Write a Review" button
  - Responsive design for all device sizes
  - Loading and error states
  - Internationalization support

### 2. Backend Models
- **File**: `backend/src/models/Review.js`
- **Fields**:
  - `user` (ObjectId, ref: User)
  - `medicine` (ObjectId, ref: Medicine)
  - `rating` (Number, 1-5)
  - `comment` (String, max 500 characters)
  - `isVerifiedPurchase` (Boolean)
  - `timestamps` (createdAt, updatedAt)

### 3. Backend Controllers
- **File**: `backend/src/controllers/reviewController.js`
- **Functions**:
  - `getMedicineReviews` - Get all reviews for a medicine
  - `addReview` - Add a review for a medicine
  - `getReviewStats` - Get review statistics for a medicine

### 4. Backend Routes
- **File**: `backend/src/routes/reviews.js`
- **Endpoints**:
  - `GET /api/reviews/medicine/:medicineId` - Get reviews for a medicine
  - `POST /api/reviews/medicine/:medicineId` - Add a review
  - `GET /api/reviews/medicine/:medicineId/stats` - Get review statistics

### 5. Seeding
- **File**: `backend/seed/seedReviews.js`
- **Features**:
  - Generates sample reviews for medicines
  - Assigns random ratings (1-5)
  - Uses sample comments from a predefined list
  - Sets verification status randomly

## Integration Points

### 1. Database
The Review model references both User and Medicine models, creating relationships between reviews, users, and products.

### 2. API
The reviews API is accessible at `/api/reviews/*` and follows the same authentication patterns as other APIs.

### 3. Frontend
The CustomerReviews component can be imported and used in any page or section of the application.

## Seeding Data
To seed review data:
```bash
cd backend
node seed/seedReviews.js
```

Or run the complete seeding process:
```bash
cd backend
node seed/seedAll.js
```

## Future Enhancements
1. Add review moderation features
2. Implement review voting (helpful/not helpful)
3. Add photo uploads for reviews
4. Implement review reporting functionality
5. Add seller response to reviews