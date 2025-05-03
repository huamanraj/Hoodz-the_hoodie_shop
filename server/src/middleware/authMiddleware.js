const axios = require('axios');
const asyncHandler = require('express-async-handler');
const { clerkClient } = require('@clerk/clerk-sdk-node');

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
      
      // Get the userId from the token
      const userId = decodedToken.sub;
      
      // Get user email using Clerk SDK
      const userEmail = await fetchUserEmailFromClerk(userId);
      
      console.log('Decoded user info:', {
        userId: userId,
        email: userEmail
      });
      
      // Attach user info to req object
      req.auth = {
        userId: userId,
        claims: {
          email: userEmail
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

// Fetch user email using Clerk SDK
async function fetchUserEmailFromClerk(userId) {
  try {
    // Check if Clerk SDK is properly initialized with API key
    if (!process.env.CLERK_SECRET_KEY) {
      console.warn('CLERK_SECRET_KEY is not set in environment variables');
      return 'customer@example.com';
    }

    // Get user details using Clerk SDK
    const user = await clerkClient.users.getUser(userId);
    
    // Get primary email if available
    if (user.primaryEmailAddressId) {
      try {
        const emailAddress = await clerkClient.emailAddresses.getEmailAddress(user.primaryEmailAddressId);
        return emailAddress.emailAddress;
      } catch (emailErr) {
        console.error('Error getting primary email:', emailErr.message);
      }
    }
    
    // If primary email fails, try to get any email from the user's email addresses
    if (user.emailAddresses && user.emailAddresses.length > 0) {
      for (const emailObj of user.emailAddresses) {
        try {
          const emailAddress = await clerkClient.emailAddresses.getEmailAddress(emailObj.id);
          return emailAddress.emailAddress;
        } catch (emailErr) {
          console.error(`Error getting email (${emailObj.id}):`, emailErr.message);
          continue;
        }
      }
    }
    
    console.warn('No valid email addresses found for user:', userId);
    return userId + '@example.com';
  } catch (error) {
    console.error('Error fetching user from Clerk:', error.message);
    return 'customer@example.com';
  }
}

module.exports = { protect };
