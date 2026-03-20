# FoodDonation Backend (Fastify + MongoDB)

A production-ready REST & WebSocket API built with Node.js and Fastify, designed specifically for the FoodDonation Flutter app.

## 🚀 Features

- **Standardized API**: Clean JSON responses with consistent SUCCESS/ERROR wrappers.
- **Real-time Updates**: WebSocket integration for instant food requests and status updates.
- **Auth System**: Secure JWT-based authentication with Google Sign-In support.
- **Geospatial Queries**: MongoDB `$near` integration for the "Nearby Shops" discovery feature.
- **Cloudinary Storage**: Optimized image management for food and shop profiles.
- **Render-Ready**: Fully configured for one-click deployment to Render.com.

## 🛠️ Tech Stack

- **Framework**: Fastify (Node.js)
- **Database**: MongoDB Atlas (Mongoose)
- **Communications**: WebSockets (@fastify/websocket)
- **Authentication**: @fastify/jwt & bcryptjs
- **Images**: Cloudinary
- **Validation**: Zod

## 📦 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster
- Cloudinary account

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Install & Run
```bash
npm install
npm start
```

## 📍 API Endpoints

- **Auth**: `/auth/register`, `/auth/login`, `/auth/google`
- **Foods**: `/foods` (All/Category), `/foods/my` (Shopkeeper)
- **Shops**: `/shops/nearby` (Geospatial), `/shops/my`
- **Requests**: `/requests/receiver`, `/requests/shopkeeper`, `/requests/:id/accept`

## ⚡ WebSocket Events
- **Socket URL**: `ws://your-api-url/ws?userId={userId}`
- **Incoming**: `newRequest` (for Shopkeepers)
- **Outgoing**: `requestUpdate` (for Receivers)
