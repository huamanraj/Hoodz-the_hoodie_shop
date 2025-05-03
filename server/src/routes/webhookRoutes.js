const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');
const { validateRazorpayWebhook } = require('../utils/razorpayUtils');
const { sendPaymentFailureEmail } = require('../utils/emailUtils');

// Razorpay webhook handler for payment events
router.post('/razorpay', async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];
    
    // Validate webhook signature
    const webhookBody = JSON.stringify(req.body);
    const isValidSignature = validateRazorpayWebhook(webhookBody, signature, webhookSecret);
    
    if (!isValidSignature) {
      console.error('Invalid webhook signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }
    
    const event = req.body;
    console.log('Webhook received:', event.event);
    
    // Handle payment failed event
    if (event.event === 'payment.failed') {
      const razorpayOrderId = event.payload.payment.entity.order_id;
      
      // Find our order with this Razorpay order ID
      const order = await Order.findOne({ 'paymentResult.id': razorpayOrderId });
      
      if (order) {
        // Update order status
        order.paymentResult = {
          ...order.paymentResult,
          status: 'FAILED',
          update_time: Date.now().toString(),
        };
        await order.save();
        
        // Send payment failure email
        const errorMessage = event.payload.payment.entity.error_description || 
                            'The payment transaction was declined by your bank or payment provider.';
        
        await sendPaymentFailureEmail(order, errorMessage);
        
        console.log(`Payment failure email sent for order: ${order._id}`);
      } else {
        console.log(`Order not found for Razorpay order ID: ${razorpayOrderId}`);
      }
    }
    
    // Always respond with 200 to acknowledge receipt
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
