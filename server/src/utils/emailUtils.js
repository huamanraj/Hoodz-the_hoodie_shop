const nodemailer = require('nodemailer');

// Create reusable transporter with Gmail and app password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

// Email templates
const getOrderSuccessTemplate = (order) => {
  const items = order.orderItems.map(item => 
    `<tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} (${item.size || 'N/A'})</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`
  ).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #000; color: #fff; padding: 20px; text-align: center; }
        .content { padding: 20px; border: 1px solid #eee; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #777; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 10px; border-bottom: 2px solid #000; }
        .summary { margin-top: 20px; background-color: #f9f9f9; padding: 15px; }
        .button { display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; margin-top: 15px; }
        .logo { font-size: 32px; font-weight: bold; letter-spacing: 2px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">HOODZ</div>
          <h1>Order Confirmed!</h1>
        </div>
        <div class="content">
          <p>Dear Customer,</p>
          <p>Thank you for your order! We're pleased to confirm that your payment has been successfully processed.</p>
          
          <h2>Order Details</h2>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Payment ID:</strong> ${order.paymentResult?.id || 'N/A'}</p>
          <p><strong>Date:</strong> ${new Date(order.paidAt || order.createdAt).toLocaleString()}</p>
          
          <h2>Items Ordered</h2>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${items}
            </tbody>
          </table>
          
          <div class="summary">
            <p><strong>Subtotal:</strong> ₹${order.subtotal.toFixed(2)}</p>
            <p><strong>Shipping:</strong> ₹${order.shippingPrice.toFixed(2)}</p>
            <p><strong>Tax:</strong> ₹${order.taxPrice.toFixed(2)}</p>
            <p><strong>Total:</strong> ₹${order.totalPrice.toFixed(2)}</p>
          </div>
          
          <h2>Shipping Address</h2>
          <p>
            ${order.shippingAddress.address}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
            ${order.shippingAddress.country}
          </p>
          
          <p>We'll send you another email when your items have been shipped.</p>
          <a href="https://hoodz.vercel.app/orders/${order._id}" class="button">View Order Details</a>
        </div>
        <div class="footer">
          <p>If you have any questions, please contact our customer service at support@hoodz.com</p>
          <p>&copy; ${new Date().getFullYear()} Hoodz. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const getOrderFailedTemplate = (order, errorMessage) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Payment Failed</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8d7da; color: #721c24; padding: 20px; text-align: center; }
        .content { padding: 20px; border: 1px solid #f5c6cb; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #777; }
        .button { display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; margin-top: 15px; }
        .logo { font-size: 32px; font-weight: bold; letter-spacing: 2px; color: #333; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">HOODZ</div>
          <h1>Payment Failed</h1>
        </div>
        <div class="content">
          <p>Dear Customer,</p>
          <p>We're sorry, but there was an issue processing your payment for your recent order.</p>
          
          <h2>Order Details</h2>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
          <p><strong>Amount:</strong> ₹${order.totalPrice.toFixed(2)}</p>
          
          <h2>What happened?</h2>
          <p>${errorMessage || 'Your payment could not be processed at this time.'}</p>
          
          <h2>What next?</h2>
          <p>You can try placing your order again by visiting our website.</p>
          <p>If you continue to face issues, please contact our customer support team.</p>
          
          <a href="https://hoodz.vercel.app/cart" class="button">Return to Cart</a>
        </div>
        <div class="footer">
          <p>If you have any questions, please contact our customer service at support@hoodz.com</p>
          <p>&copy; ${new Date().getFullYear()} Hoodz. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Send order confirmation email
 * @param {Object} order - Order object from database
 * @returns {Promise} - Nodemailer send result
 */
const sendOrderConfirmationEmail = async (order) => {
  try {
    // Verify email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      console.error('Email configuration missing. Check EMAIL_USER and EMAIL_APP_PASSWORD env variables.');
      return;
    }

    const mailOptions = {
      from: `"Hoodz Store" <${process.env.EMAIL_USER}>`,
      to: order.userEmail,
      subject: `Order Confirmed - Hoodz #${order._id}`,
      html: getOrderSuccessTemplate(order)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
};

/**
 * Send payment failure email
 * @param {Object} order - Order object from database
 * @param {String} errorMessage - Error message explaining the failure
 * @returns {Promise} - Nodemailer send result
 */
const sendPaymentFailureEmail = async (order, errorMessage) => {
  try {
    // Verify email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      console.error('Email configuration missing. Check EMAIL_USER and EMAIL_APP_PASSWORD env variables.');
      return;
    }

    // Ensure order has a valid email
    if (!order.userEmail || order.userEmail === 'not_available' || order.userEmail === 'user@example.com') {
      console.error('Order missing valid email address:', order.userEmail);
      return;
    }

    const mailOptions = {
      from: `"Hoodz Store" <${process.env.EMAIL_USER}>`,
      to: order.userEmail,
      subject: `Payment Failed - Hoodz Order #${order._id}`,
      html: getOrderFailedTemplate(order, errorMessage)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Payment failure email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending payment failure email:', error);
    throw error;
  }
};

/**
 * Test email configuration by sending a test email
 * @param {String} toEmail - Email address to send test to
 * @returns {Promise} - Nodemailer send result
 */
const sendTestEmail = async (toEmail) => {
  try {
    // Verify email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      console.error('Email configuration missing. Check EMAIL_USER and EMAIL_APP_PASSWORD env variables.');
      throw new Error('Email configuration missing');
    }

    const mailOptions = {
      from: `"Hoodz Store" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Hoodz Email Configuration Test',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Email Test</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #000; color: #fff; padding: 20px; text-align: center; }
            .content { padding: 20px; border: 1px solid #eee; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #777; }
            .logo { font-size: 32px; font-weight: bold; letter-spacing: 2px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">HOODZ</div>
              <h1>Email Configuration Test</h1>
            </div>
            <div class="content">
              <p>This is a test email from your Hoodz application.</p>
              <p>If you received this email, your email configuration is working correctly.</p>
              <p><strong>Time sent:</strong> ${new Date().toLocaleString()}</p>
              <p>Visit our website to shop the latest hoodies!</p>
              <a href="https://hoodz.vercel.app" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; margin-top: 15px;">Visit Hoodz</a>
            </div>
            <div class="footer">
              <p>If you have any questions, please contact our customer service at support@hoodz.com</p>
              <p>&copy; ${new Date().getFullYear()} Hoodz. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Test email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending test email:', error);
    throw error;
  }
};

// Helper function to verify email configuration
const verifyEmailConfig = () => {
  const isConfigured = process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD;
  if (!isConfigured) {
    console.error('EMAIL CONFIGURATION ERROR: Missing EMAIL_USER or EMAIL_APP_PASSWORD environment variables');
  }
  return isConfigured;
};

// Call verification on module load
verifyEmailConfig();

module.exports = {
  sendOrderConfirmationEmail,
  sendPaymentFailureEmail,
  sendTestEmail,
  verifyEmailConfig
};
