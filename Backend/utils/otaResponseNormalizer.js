/**
 * OTA Response Normalizer
 * Ensuring that third-party data maps predictably to our internal schema.
 */
class OTAResponseNormalizer {
  /**
   * Normalize items to match local Hotel schema
   */
  normalizeHotels(rawData) {
    if (!rawData) return [];
    
    // Supporting both single object and array responses
    const items = Array.isArray(rawData) ? rawData : (rawData.hotels || [rawData]);
    
    return items.map(item => ({
      _id: `ota_${item.id || Math.random().toString(36).substr(2, 9)}`,
      name: item.name || item.hotel_name || 'Generic Hotel',
      destination: item.city || item.destination || 'Unspecified',
      location: item.address || item.location || '',
      packageType: this._normalizeTier(item.tier, item.package_type),
      images: item.photos || item.images || [],
      amenities: item.facilities || item.amenities || [],
      description: item.summary || item.description || '',
      rating: parseFloat(item.star_rating || item.rating || 0),
      isActive: true,
      isOTA: true,
      otaApiLink: item.booking_url || item.url || ''
    }));
  }

  _normalizeTier(tier, altTier) {
    const val = tier || altTier || 'Standard';
    return Array.isArray(val) ? val : [val];
  }

  /**
   * Create standardized error response as requested by Bookingjini
   */
  createErrorResponse(message, code = 500, details = null) {
    return {
      success: false,
      error: {
        message,
        code: this._mapErrorCode(code),
        details: details || {}
      },
      timestamp: new Date().toISOString()
    };
  }

  _mapErrorCode(status) {
    const codes = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_SERVER_ERROR'
    };
    return codes[status] || 'UNKNOWN_ERROR';
  }
}

module.exports = new OTAResponseNormalizer();
