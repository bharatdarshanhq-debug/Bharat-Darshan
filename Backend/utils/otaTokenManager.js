const axios = require('axios');

/**
 * OTA Token Manager
 * Handles token lifecycle (refresh, expiration, caching)
 */
class OTATokenManager {
  constructor() {
    this.token = null;
    this.expiresAt = null;
    this.isFetching = false;
    this.fetchPromise = null;
  }

  async getValidToken() {
    // Rejection Fix: Expiration handling (buffer of 2 minutes)
    if (this.token && this.expiresAt && Date.now() < (this.expiresAt - 120000)) {
      return this.token;
    }

    if (this.isFetching) return this.fetchPromise;

    return this.refreshInternal();
  }

  async refreshInternal() {
    this.isFetching = true;
    this.fetchPromise = (async () => {
      try {
        console.log('Refreshing OTA Token...');
        
        const response = await axios.post(process.env.OTA_AUTH_URL || `${process.env.OTA_API_LINK}/token`, {
          client_id: process.env.OTA_CLIENT_ID,
          client_secret: process.env.OTA_CLIENT_SECRET,
          grant_type: 'client_credentials'
        }, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 5000
        });

        if (response.data && response.data.access_token) {
          this.token = response.data.access_token;
          const expiresIn = response.data.expires_in || 3600;
          this.expiresAt = Date.now() + (expiresIn * 1000);
          return this.token;
        } else {
          throw new Error('Invalid token response');
        }
      } catch (error) {
        console.error('OTA Token Refresh Failed:', error.response?.data || error.message);
        throw error;
      } finally {
        this.isFetching = false;
        this.fetchPromise = null;
      }
    })();

    return this.fetchPromise;
  }

  clearToken() {
    this.token = null;
    this.expiresAt = null;
  }
}

module.exports = new OTATokenManager();
