const otaResponseNormalizer = require('../utils/otaResponseNormalizer');

// Simple In-memory rate limiting
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60000; 
const MAX_REQUESTS = 30; 

/**
 * OTA Request Middleware
 * Handles schema validation, rate limiting, and retry logic for OTA interactions.
 */
const validateOtaRequest = (req, res, next) => {
  const { destination, packageType } = req.query;
  const ip = req.ip;

  // 1. Rate Limiting (Rejection Fix: Prevent request flooding)
  const now = Date.now();
  const userData = requestCounts.get(ip) || { count: 0, firstRequest: now };

  if (now - userData.firstRequest > RATE_LIMIT_WINDOW) {
    userData.count = 1;
    userData.firstRequest = now;
  } else {
    userData.count++;
  }
  requestCounts.set(ip, userData);

  if (userData.count > MAX_REQUESTS) {
    return res.status(429).json(
      otaResponseNormalizer.createErrorResponse('Too many requests. Please try again later.', 429)
    );
  }

  // 2. Schema Validation (Rejection Fix: Mandatory fields and parameter handling)
  if (req.path.includes('/hotels') && packageType && !destination) {
    return res.status(400).json(
      otaResponseNormalizer.createErrorResponse('Destination is required when filtering by package type for OTA results', 400)
    );
  }

  next();
};

/**
 * Simple Backoff/Retry wrapper
 * (Can be used within controllers or providers)
 */
const withRetry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    
    // Only retry on transient errors (5xx, 429)
    const status = error.response?.status;
    if (status >= 500 || status === 429) {
      console.log(`Retrying OTA call... ${retries} attempts left. Delay: ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2); // Exponential backoff
    }
    
    throw error;
  }
};

module.exports = {
  validateOtaRequest,
  withRetry
};
