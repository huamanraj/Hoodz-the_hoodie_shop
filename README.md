# HOODZ - Premium Hoodie Marketplace

## Overview

HOODZ is a modern e-commerce platform specializing in premium hoodies and streetwear collections. Built with React, TypeScript, and a Node.js backend, it offers a seamless shopping experience for urban fashion enthusiasts.

## Features

- 🛍️ **Curated Collection**: Browse through our exclusive selection of premium hoodies
- 🔐 **User Authentication**: Secure login/signup with Clerk integration
- 🛒 **Shopping Cart**: Easy-to-use cart functionality with persistent storage
- 💳 **Secure Payments**: Integrated with Razorpay for safe transactions
- 📱 **Responsive Design**: Optimized for all devices with a modern UI using Shadcn components


## Tech Stack

### Frontend
- React + TypeScript
- Vite for fast builds
- TailwindCSS for styling
- Shadcn UI components
- React Router for navigation
- React Query for data fetching

### Backend
- Node.js + Express
- MongoDB with Mongoose
- Clerk for authentication
- Razorpay payment integration
- Nodemailer for transactional emails

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB instance
- Clerk account for authentication
- Razorpay account for payments

### Installation

1. Clone the repository
```bash
git clone repo
cd hoodz
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd server
npm install
```

4. Set up environment variables
   - Create `.env` file in the root directory
   - Create `.env` file in the server directory

5. Start development servers

Frontend:
```bash
npm run dev
```

Backend:
```bash
cd server
npm run dev
```

6. Seed the database (optional)
```bash
cd server
npm run seed
```

## Deployment

The application is configured for deployment on Vercel (frontend) and can be deployed to any Node.js hosting service for the backend.

> amanraj.me