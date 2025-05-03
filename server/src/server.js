// Load environment variables first before any other imports
require('dotenv').config();

// Log environment variables for debugging
console.log('Environment variables check:');
console.log('PORT:', process.env.PORT);
console.log('RAZORPAY_KEY_ID exists:', !!process.env.RAZORPAY_KEY_ID);
console.log('RAZORPAY_KEY_SECRET exists:', !!process.env.RAZORPAY_KEY_SECRET);

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Initialize express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// API routes
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`API routes available at ${process.env.API_URL || '/api/v1'}`);
});