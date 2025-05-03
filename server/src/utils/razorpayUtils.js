const crypto = require('crypto');

/**
 * Validates Razorpay webhook signature
 * @param {string} webhookBody - The raw webhook body as string
 * @param {string} razorpaySignature - The signature from Razorpay in the headers
 * @param {string} webhookSecret - Your Razorpay webhook secret key
 * @returns {boolean} - Whether the signature is valid
 */
const validateRazorpayWebhook = (webhookBody, razorpaySignature, webhookSecret) => {
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(webhookBody)
    .digest('hex');
  
  return expectedSignature === razorpaySignature;
};

/**
 * Verifies a Razorpay payment
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Razorpay signature
 * @param {string} secret - Razorpay key secret
 * @returns {boolean} - Whether the payment verification is valid
 */
const verifyRazorpayPayment = (orderId, paymentId, signature, secret) => {
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(orderId + '|' + paymentId)
    .digest('hex');
  
  return generatedSignature === signature;
};

module.exports = {
  validateRazorpayWebhook,
  verifyRazorpayPayment
};
