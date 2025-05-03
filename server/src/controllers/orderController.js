const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { sendOrderConfirmationEmail, sendPaymentFailureEmail, sendTestEmail, verifyEmailConfig } = require('../utils/emailUtils');

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
    // Get customer email - check if it's a placeholder and use shipping info if possible
    let userEmail = req.auth.claims.email;
    
    // If we have a placeholder email and shipping address has email, use that
    if (userEmail.includes('@example.com') && shippingAddress && shippingAddress.email) {
      userEmail = shippingAddress.email;
      console.log(`Using shipping address email instead: ${userEmail}`);
    }
    
    // Create order in database
    const order = new Order({
      userId: req.auth.userId,
      userEmail: userEmail,
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

    // Make sure user email is set and not a placeholder
    if (!order.userEmail || 
        order.userEmail === 'not_available' || 
        order.userEmail.includes('@example.com')) {
      
      // Try to get a better email from different sources
      const betterEmail = req.body.email || 
                         req.auth.claims.email || 
                         order.shippingAddress.email;
      
      if (betterEmail && !betterEmail.includes('@example.com')) {
        order.userEmail = betterEmail;
        console.log(`Updated order email to: ${order.userEmail}`);
      } else {
        console.log(`No valid email found for order: ${order._id}`);
      }
    }

    const updatedOrder = await order.save();
    
    // Send success email only if we have a valid email (not example.com)
    if (!updatedOrder.userEmail.includes('@example.com')) {
      try {
        console.log(`Attempting to send order confirmation email to: ${updatedOrder.userEmail}`);
        await sendOrderConfirmationEmail(updatedOrder);
        console.log(`Successfully sent order confirmation email to: ${updatedOrder.userEmail}`);
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError);
        // Continue execution - don't fail the order just because email failed
      }
    } else {
      console.log(`Skipping email for order ${order._id} - no valid email address available`);
    }
    
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

// @desc    Test email configuration
// @route   POST /api/v1/orders/test-email
// @access  Private
const testEmailConfig = asyncHandler(async (req, res) => {
  try {
    const userEmail = req.auth.claims.email;
    
    if (!userEmail || userEmail === 'customer@example.com') {
      res.status(400);
      throw new Error('Valid user email not found in authentication token');
    }
    
    console.log(`Sending test email to: ${userEmail}`);
    
    // Verify email configuration first
    if (!verifyEmailConfig()) {
      res.status(500);
      throw new Error('Email not configured. Check server environment variables.');
    }
    
    const result = await sendTestEmail(userEmail);
    
    res.json({
      success: true,
      message: 'Test email sent successfully',
      emailId: result.messageId,
      sentTo: userEmail
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500);
    throw new Error(`Failed to send test email: ${error.message}`);
  }
});

module.exports = {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  testEmailConfig
};
