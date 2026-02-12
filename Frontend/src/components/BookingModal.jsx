import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, Phone, MessageSquare, CreditCard, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/forms';
import { sonnerToast as toast } from '@/components/ui/feedback';
import { createBooking, createPaymentOrder, verifyPayment, getRazorpayKey } from '@/services/packageService';

const BookingModal = ({ isOpen, onClose, pkg, user, token, initialTravelers = 2 }) => {
  const navigate = useNavigate();
  const [tripDate, setTripDate] = useState('');
  const [travelers, setTravelers] = useState(initialTravelers);
  const [contactPhone, setContactPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);

  // Helper to parse group size - duplicated from PackageDetail to ensure consistency
  const parseMaxGroupSize = (groupSize) => {
    if (!groupSize) return 1;
    const match = groupSize.match(/(\d+)\s*[-–]\s*(\d+)/);
    if (match) return parseInt(match[2], 10);
    const single = groupSize.match(/(\d+)/);
    if (single) return parseInt(single[1], 10);
    return 1;
  };

  const numericPrice = Number(pkg?.price) || 0;
  const numericOriginalPrice = (pkg?.originalPrice && !isNaN(pkg.originalPrice)) ? Number(pkg.originalPrice) : 0;
  const maxIncludedTravelers = parseMaxGroupSize(pkg?.groupSize);

  // Logic: Base price covers up to maxIncludedTravelers. Extra travelers cost 30% of base price.
  const calculateTotal = (basePrice) => {
    if (!basePrice) return 0;
    const extraTravelers = Math.max(0, travelers - maxIncludedTravelers);
    return Math.round(basePrice + (extraTravelers * basePrice * 0.3));
  };

  const totalPrice = calculateTotal(numericPrice);
  const totalOriginalPrice = calculateTotal(numericOriginalPrice);
  const savings = (totalOriginalPrice > totalPrice) ? (totalOriginalPrice - totalPrice) : 0;

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleSubmit = async () => {
    if (!tripDate) {
      toast.error('Please select a trip date');
      return;
    }
    if (!contactPhone || contactPhone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    if (!user || !token) {
      toast.info('Please login to book this package');
      onClose();
      navigate('/login', { state: { from: `/packages/${pkg._id || pkg.legacyId}` } });
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create booking
      const bookingData = {
        packageId: pkg.legacyId || pkg._id,
        packageName: pkg.name,
        packageImage: pkg.image,
        travelers,
        tripDate: new Date(tripDate).toISOString(),
        totalPrice,
        contactPhone,
        specialRequests,
      };

      const booking = await createBooking(bookingData, token);
      toast.success('Booking created! Proceeding to payment...');

      // Step 2: Create payment order
      try {
        const razorpayKey = await getRazorpayKey();
        
        // Check if Razorpay is properly configured
        if (!razorpayKey) {
          toast.info('Payment gateway is not configured. Booking saved successfully!');
          onClose();
          // Redirect to hotel selection page first
          window.location.href = `/bookings/${booking._id}/select-hotels`;
          return;
        }

        const orderData = await createPaymentOrder(totalPrice, booking._id, token);

        // Step 3: Load Razorpay and process payment
        const options = {
          key: orderData.key,
          amount: orderData.order.amount,
          currency: orderData.order.currency,
          name: 'Bharat Darshan',
          description: `Booking for ${pkg.name}`,
          order_id: orderData.order.id,
          handler: async (response) => {
            try {
              await verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: booking._id,
              }, token);
              
              toast.success('Payment successful! Your booking is confirmed.');
              onClose();
              // Redirect to hotel selection page first
              window.location.href = `/bookings/${booking._id}/select-hotels`;
            } catch (error) {
              toast.error('Payment verification failed. Please contact support.');
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
            contact: contactPhone,
          },
          theme: {
            color: '#EA580C',
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (paymentError) {
        // Payment gateway not configured - just save booking
        if (paymentError.message.includes('not configured')) {
          toast.info('Booking saved! Our team will contact you for payment.');
          onClose();
        } else {
          throw paymentError;
        }
      }
    } catch (error) {
      toast.error(error.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const discountPercentage = (totalOriginalPrice > totalPrice && totalOriginalPrice > 0) 
    ? Math.round(((totalOriginalPrice - totalPrice) / totalOriginalPrice) * 100) 
    : 0;

  if (!isOpen || !pkg) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-100 p-6 flex items-center justify-between z-10">
            <div>
              <h2 className="font-serif text-2xl font-bold text-gray-900">Book Your Trip</h2>
              <p className="text-sm text-gray-500 mt-1">{pkg.name}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Package Summary */}
            <div className="bg-orange-50 rounded-2xl p-4 flex gap-4">
              <img
                src={pkg.image}
                alt={pkg.name}
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div className="flex-1">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                  pkg.type === 'Elite' ? 'bg-gray-900 text-amber-400' :
                  pkg.type === 'Pro' ? 'bg-orange-100 text-orange-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {pkg.type}
                </span>
                <h3 className="font-medium mt-1">{pkg.name}</h3>
                <p className="text-sm text-gray-500">{pkg.duration}</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Trip Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Select Trip Date
                </label>
                <input
                  type="date"
                  min={getMinDate()}
                  value={tripDate}
                  onChange={(e) => setTripDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                />
              </div>

              {/* Travelers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Number of Travelers
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-orange-100 hover:text-orange-600 transition-colors font-bold text-xl"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold w-12 text-center">{travelers}</span>
                  <button
                    onClick={() => setTravelers(travelers + 1)}
                    className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-orange-100 hover:text-orange-600 transition-colors font-bold text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Contact Phone
                </label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                />
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Special Requests (Optional)
                </label>
                <textarea
                  placeholder="Any special requirements or requests..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none"
                />
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
              {/* Original Price - shown with strikethrough when there's a discount */}
              {totalOriginalPrice > totalPrice && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Original Price (for {maxIncludedTravelers} pax)</span>
                  <span className="text-gray-400 line-through font-medium">₹{numericOriginalPrice.toLocaleString()}</span>
                </div>
              )}
              
              {/* Discounted/Current Price */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {totalOriginalPrice > totalPrice ? 'Discounted Price' : 'Base Price'} (for {maxIncludedTravelers} pax)
                </span>
                <span className="font-medium text-green-600">₹{numericPrice.toLocaleString()}</span>
              </div>
              
              {/* Extra Travelers charge */}
              {travelers > maxIncludedTravelers && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Extra Travelers ({travelers - maxIncludedTravelers})</span>
                  <span className="font-medium">₹{(totalPrice - numericPrice).toLocaleString()}</span>
                </div>
              )}
              
              <div className="h-px bg-gray-200" />
               
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <div className="flex items-center gap-2">
                  <span className="text-orange-600">₹{totalPrice.toLocaleString()}</span>
                  {totalOriginalPrice > totalPrice && (
                    <span className="text-gray-400 line-through text-sm font-normal">
                      ₹{totalOriginalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              {savings > 0 && (
                <div className="flex justify-end text-sm text-green-600 font-medium">
                  ✓ You save ₹{savings.toLocaleString()} <span className="ml-1 bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-xs"> {discountPercentage}% OFF</span>
                </div>
              )}
            </div>

            {/* Security Note */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Secure payment powered by Razorpay</span>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white rounded-b-3xl border-t border-gray-100 p-6">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-lg font-medium shadow-lg shadow-orange-200"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay ₹{totalPrice.toLocaleString()}
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;
