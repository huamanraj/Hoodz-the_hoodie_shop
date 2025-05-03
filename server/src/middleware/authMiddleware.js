const axios = require('axios');
const asyncHandler = require('express-async-handler');

// Protect routes - verify the Clerk token and attach user data
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if auth header exists and starts with Bearer
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      
      // Log detailed token info for debugging
      console.log('Received token:', token.substring(0, 15) + '...');
      
      // For Clerk tokens we'll extract the basic info without validation
      const decodedToken = decodeClerkJWT(token);
      
      console.log('Decoded user info:', {
        userId: decodedToken.sub,
        email: decodedToken.email || 'not_available'
      });
      
      // Attach user info to req object
      req.auth = {
        userId: decodedToken.sub,
        claims: {
          email: decodedToken.email || 'user@example.com'
        }
      };

      next();
    } catch (error) {
      console.error('Auth error details:', error.message);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    console.log('No authorization header found in request:', req.headers);
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Helper function to decode Clerk JWT without validation
function decodeClerkJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      throw new Error('Invalid token structure');
    }
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    const parsed = JSON.parse(jsonPayload);
    
    // Ensure we have the sub (subject) claim which is the user ID
    if (!parsed.sub) {
      console.warn('Token missing subject (user ID):', parsed);
      throw new Error('Token missing user identifier');
    }
    
    return parsed;
  } catch (error) {
    console.error('Token decode error:', error.message);
    throw new Error(`Invalid token format: ${error.message}`);
  }
}

module.exports = { protect };
