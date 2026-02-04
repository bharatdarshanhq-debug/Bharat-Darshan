// Admin Types for Bharat Darshan - JavaScript version
// These are exported as constants for reference and documentation purposes

/**
 * @typedef {'Lite' | 'Standard' | 'Pro' | 'Premium' | 'Elite'} TierType
 * @typedef {'pending' | 'confirmed' | 'cancelled' | 'completed'} BookingStatus
 * @typedef {'pending' | 'paid' | 'refunded' | 'failed'} PaymentStatus
 * @typedef {'new' | 'contacted' | 'resolved'} InquiryStatus
 */

/**
 * @typedef {Object} Package
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string} destination
 * @property {TierType} tier
 * @property {string} duration
 * @property {string} groupSize
 * @property {{pro: number, premium: number, elite: number}} pricing
 * @property {string[]} itinerary
 * @property {string[]} highlights
 * @property {string[]} facilities
 * @property {string[]} included
 * @property {string[]} excluded
 * @property {string} hotelDetails
 * @property {string[]} images
 * @property {boolean} isActive
 * @property {number} sortOrder
 * @property {string} [metaTitle]
 * @property {string} [metaDescription]
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} Destination
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string} heroImage
 * @property {string} shortDescription
 * @property {string} [bestTime]
 * @property {string[]} [mustVisit]
 * @property {{lat: number, lng: number}} [mapCoordinates]
 * @property {{question: string, answer: string}[]} [faqs]
 * @property {boolean} isActive
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} Hotel
 * @property {string} id
 * @property {string} name
 * @property {string} destination
 * @property {string} location
 * @property {string[]} images
 * @property {string[]} amenities
 * @property {string} description
 * @property {number} rating
 * @property {TierType[]} tierApplicability
 * @property {boolean} isActive
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} Booking
 * @property {string} id
 * @property {string} customerName
 * @property {string} customerEmail
 * @property {string} customerPhone
 * @property {string} packageId
 * @property {string} packageName
 * @property {string} destination
 * @property {TierType} tier
 * @property {string} tripDate
 * @property {number} travelers
 * @property {number} totalPrice
 * @property {BookingStatus} status
 * @property {PaymentStatus} paymentStatus
 * @property {string[]} [selectedHotels]
 * @property {string} [notes]
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} Inquiry
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} [phone]
 * @property {string} subject
 * @property {string} message
 * @property {InquiryStatus} status
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} DashboardStats
 * @property {number} totalBookings
 * @property {number} pendingBookings
 * @property {number} confirmedBookings
 * @property {number} todayInquiries
 * @property {number} totalRevenue
 * @property {number} monthlyRevenue
 * @property {number} activePackages
 * @property {number} activeDestinations
 */

// Export tier types as constants
export const TIER_TYPES = ['Lite', 'Standard', 'Pro', 'Premium', 'Elite'];
export const BOOKING_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];
export const PAYMENT_STATUSES = ['pending', 'paid', 'refunded', 'failed'];
export const INQUIRY_STATUSES = ['new', 'contacted', 'resolved'];
