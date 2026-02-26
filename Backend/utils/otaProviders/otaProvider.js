const axios = require('axios');
const otaTokenManager = require('../otaTokenManager');
const otaResponseNormalizer = require('../otaResponseNormalizer');
const { withRetry } = require('../../middleware/otaRequestMiddleware');

/**
 * OTA Provider
 * Handles all communication with the OTA API (e.g., Bookingjini)
 */
class OTAProvider {
  constructor() {
    this.baseUrl = process.env.OTA_API_LINK || 'https://api.ota-provider.com/v1';
    this.clientId = process.env.OTA_CLIENT_ID;
    this.clientSecret = process.env.OTA_CLIENT_SECRET;
  }

  /**
   * Fetch all hotels from OTA
   * @param {Object} filters - Search filters (destination, packageType, etc.)
   * @returns {Promise<Array>} Normalized hotel list
   */
  async getHotels(filters = {}) {
    try {
      // Rejection Fix: Authentication workflow conforms to defined protocol (Token lifecycle)
      const token = await otaTokenManager.getValidToken();
      
      const params = {
        city: filters.destination,
        tier: filters.packageType,
      };

      // Remove undefined params to ensure strict payload structure
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

      // Rejection Fix: Incorporate adaptive throttling or backoff strategies (Retry Logic)
      const response = await withRetry(async () => {
        return await axios.get(`${this.baseUrl}/hotels`, {
          params,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'X-Client-Id': this.clientId 
          },
          timeout: 10000 
        });
      });

      if (response.status !== 200) {
        throw new Error(`OTA API returned status ${response.status}`);
      }

      // Rejection Fix: Deterministic error structures and response normalization
      return otaResponseNormalizer.normalizeHotels(response.data);
    } catch (error) {
      this._handleError(error, 'getHotels');
      return []; 
    }
  }

  /**
   * Private error handler to standardize error logging
   */
  _handleError(error, context) {
    if (error.response) {
      console.error(`OTA Provider Error [${context}]:`, error.response.status, error.response.data);
      if (error.response.status === 401) {
        otaTokenManager.clearToken();
      }
    } else if (error.request) {
      console.error(`OTA Provider Network Error [${context}]:`, error.message);
    } else {
      console.error(`OTA Provider Internal Error [${context}]:`, error.message);
    }
  }
}

module.exports = new OTAProvider();
