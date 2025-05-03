const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { sendOrderConfirmationEmail, sendPaymentFailureEmail } = require('../utils/emailUtils');

// Initialize Razorpay with proper error handling
let razorpay;
try {
  // Check if environment variables are available
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error('Razorpay credentials missing from environment variables!');
    console.error('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? 'Present' : 'Missing');
    console.error('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'Present' : 'Missing');
  } else {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('Razorpay initialized with key_id:', process.env.RAZORPAY_KEY_ID);
  }
} catch (error) {
  console.error('Failed to initialize Razorpay:', error);
}

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    subtotal,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Verify Razorpay is initialized
  if (!razorpay) {
    console.error('Razorpay not initialized');
    res.status(500);
    throw new Error('Payment service unavailable');
  }

  try {
    // Create order in database
    const order = new Order({
      userId: req.auth.userId,
      userEmail: req.auth.claims.email,
      orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      taxPrice,
      shippingPrice,
      totalPrice,
      status: 'Processing',
    });

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalPrice * 100), // amount in paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
    });

    // Add Razorpay order ID to our order
    order.paymentResult = {
      id: razorpayOrder.id,
      status: razorpayOrder.status,
      update_time: Date.now().toString(),
    };

    // Save the order
    const createdOrder = await order.save();

    res.status(201).json({
      order: createdOrder,
      razorpayOrder: razorpayOrder,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500);
    throw new Error('Failed to create order: ' + error.message);
  }
});

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order && order.userId === req.auth.userId) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  try {
    // Verify payment signature
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      // Payment verification failed - send failure email
      await sendPaymentFailureEmail(
        order, 
        "Payment signature verification failed. This may be due to an unauthorized payment attempt."
      );
      
      res.status(400);
      throw new Error('Payment verification failed');
    }

    // Update order with payment details
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: razorpay_payment_id,
      status: 'COMPLETED',
      update_time: Date.now().toString(),
      email_address: req.auth.claims.email,
    };

    const updatedOrder = await order.save();
    
    // Send success email
    await sendOrderConfirmationEmail(updatedOrder);
    
    res.json(updatedOrder);
  } catch (error) {
    console.error('Payment processing error:', error);
    
    // Only send failure email if the error is not from email sending itself
    if (!error.message.includes('Error sending')) {
      try {
        await sendPaymentFailureEmail(
          order, 
          `There was an issue processing your payment: ${error.message}`
        );
      } catch (emailError) {
        console.error('Error sending payment failure email:', emailError);
      }
    }
    
    res.status(500);
    throw new Error(`Payment processing failed: ${error.message}`);
  }
});

// @desc    Get logged in user orders
// @route   GET /api/v1/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.auth.userId });
  res.json(orders);
});

module.exports = {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
};
