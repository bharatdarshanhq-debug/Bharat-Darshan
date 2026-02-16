import { useState, useEffect } from 'react';
import { IndianRupee, User, MapPin, Loader2 } from 'lucide-react';
import { Button, Input, Label, Textarea, Separator } from '@/components/ui/Primitives';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  sonnerToast as toast,
} from '@/components/ui/Interactive';
import { createManualBooking } from '@/services/bookingService';
import { fetchAllPackages } from '@/services/packageService';

export function BookingForm({ onClose, initialData, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState(initialData || {
    // Customer Details
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    
    // Trip Details
    tripType: 'package',
    packageId: '',
    packageName: '',
    destination: '',
    startDate: '',
    endDate: '',
    adults: 1,
    children: 0,
    specialRequests: '',

    // Payment Details
    totalAmount: '',
    advanceAmount: '',
    paymentMode: 'upi',
    transactionId: '',
    paymentStatus: 'pending',
    bookingStatus: 'confirmed'
  });

  useEffect(() => {
    // Fetch packages for dropdown
    const fetchPackages = async () => {
      try {
        const data = await fetchAllPackages();
        setPackages(Array.isArray(data) ? data : (data.packages || []));
      } catch (error) {
        console.error('Failed to fetch packages', error);
      }
    };
    fetchPackages();
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePackageChange = (packageId) => {
    const selectedPkg = packages.find(p => p._id === packageId);
    if (selectedPkg) {
      setFormData(prev => ({
        ...prev,
        packageId: selectedPkg._id,
        packageName: selectedPkg.name,
        destination: selectedPkg.primaryDestination || selectedPkg.name,
        totalAmount: selectedPkg.price ? selectedPkg.price.toString() : prev.totalAmount
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Build destination: for packages use stored destination, for custom trips use the manual input
      const resolvedDestination = formData.tripType === 'package'
        ? (formData.destination || formData.packageName)
        : formData.destination;

      const payload = {
        // Required Backend Fields
        packageId: formData.packageId || 'custom-booking',
        packageName: formData.tripType === 'package' ? formData.packageName : `Custom Trip: ${formData.destination}`,
        packageImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop',
        travelers: parseInt(formData.adults) + parseInt(formData.children),
        tripDate: formData.startDate,
        totalPrice: Number(formData.totalAmount),
        destination: resolvedDestination,
        contactPhone: formData.customerPhone,
        specialRequests: formData.specialRequests,

        // Map to backend field names (contactName / contactEmail)
        contactName: formData.customerName,
        contactEmail: formData.customerEmail,
        paymentStatus: formData.paymentStatus,
        paymentMethod: formData.paymentMode,
        paymentId: formData.transactionId,
        status: formData.bookingStatus,
      };

      await createManualBooking(payload);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form role="form" aria-label="Create booking form" onSubmit={handleSubmit} className="space-y-6">
      
      {/* Customer Information */}
      <div className="form-section">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-primary" />
          <h4 className="font-semibold text-foreground">Customer Information</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Full Name *</Label>
            <Input 
              id="customerName" 
              placeholder="Enter customer name" 
              value={formData.customerName}
              onChange={(e) => handleChange('customerName', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerEmail">Email Address *</Label>
            <Input 
              id="customerEmail" 
              type="email"
              placeholder="customer@example.com" 
              value={formData.customerEmail}
              onChange={(e) => handleChange('customerEmail', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerPhone">Phone Number *</Label>
            <Input 
              id="customerPhone" 
              placeholder="+91 98765 43210" 
              value={formData.customerPhone}
              onChange={(e) => handleChange('customerPhone', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerAddress">Address</Label>
            <Input 
              id="customerAddress" 
              placeholder="City, State" 
              value={formData.customerAddress}
              onChange={(e) => handleChange('customerAddress', e.target.value)}
            />
          </div>
        </div>
      </div>
      <Separator />

      {/* Trip Details */}
      <div className="form-section">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-primary" />
          <h4 className="font-semibold text-foreground">Trip Details</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tripType">Trip Type</Label>
            <Select 
              value={formData.tripType} 
              onValueChange={(val) => handleChange('tripType', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="package">Pre-defined Package</SelectItem>
                <SelectItem value="custom">Custom Itinerary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.tripType === 'package' ? (
             <div className="space-y-2">
             <Label htmlFor="packageName">Select Package</Label>
             <Select 
               value={formData.packageId} 
               onValueChange={handlePackageChange}
             >
               <SelectTrigger>
                 <SelectValue placeholder="Choose a package" />
               </SelectTrigger>
               <SelectContent>
                 {packages.map(pkg => (
                    <SelectItem key={pkg._id} value={pkg._id}>{pkg.name}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input 
                id="destination" 
                placeholder="Where are they going?" 
                value={formData.destination}
                onChange={(e) => handleChange('destination', e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input 
              id="startDate" 
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              required
            />
          </div>
           <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input 
              id="endDate" 
              type="date"
              value={formData.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adults">Adults</Label>
            <Input 
              id="adults" 
              type="number"
              min="1"
              value={formData.adults}
              onChange={(e) => handleChange('adults', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="children">Children</Label>
            <Input 
              id="children" 
              type="number"
              min="0"
              value={formData.children}
              onChange={(e) => handleChange('children', e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2 mt-4">
          <Label htmlFor="specialRequests">Special Requests / Preferences</Label>
          <Textarea 
            id="specialRequests" 
            rows={2} 
            placeholder="Dietary restrictions, specific hotel view, etc."
            value={formData.specialRequests}
            onChange={(e) => handleChange('specialRequests', e.target.value)}
          />
        </div>
      </div>
      <Separator />

      {/* Payment & Advance */}
      <div className="form-section">
        <div className="flex items-center gap-2 mb-4">
          <IndianRupee className="h-5 w-5 text-primary" />
          <h4 className="font-semibold text-foreground">Payment & Advance</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalAmount">Total Booking Amount (₹) *</Label>
            <Input 
              id="totalAmount" 
              type="number"
              placeholder="0.00" 
              value={formData.totalAmount}
              onChange={(e) => handleChange('totalAmount', e.target.value)}
              className="font-semibold"
              required
            />
          </div>
           <div className="space-y-2">
            <Label htmlFor="advanceAmount" className="text-primary font-medium">Advance Paid (₹)</Label>
            <Input 
              id="advanceAmount" 
              type="number"
              placeholder="0.00" 
              value={formData.advanceAmount}
              onChange={(e) => handleChange('advanceAmount', e.target.value)}
              className="border-primary/50 focus-visible:ring-primary"
            />
          </div>

           <div className="space-y-2">
            <Label htmlFor="paymentStatus">Payment Status</Label>
            <Select 
              value={formData.paymentStatus} 
              onValueChange={(val) => handleChange('paymentStatus', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="partial">Partial / Advance Paid</SelectItem>
                <SelectItem value="paid">Fully Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
           <div className="space-y-2">
            <Label htmlFor="paymentMode">Payment Mode</Label>
            <Select 
              value={formData.paymentMode} 
              onValueChange={(val) => handleChange('paymentMode', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upi">UPI (GPay/PhonePe)</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer (NEFT/IMPS)</SelectItem>
                <SelectItem value="card">Credit/Debit Card</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
           <div className="space-y-2">
            <Label htmlFor="transactionId">Transaction ID / Reference</Label>
            <Input 
              id="transactionId" 
              placeholder="Enter transaction ref no." 
              value={formData.transactionId}
              onChange={(e) => handleChange('transactionId', e.target.value)}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex justify-end gap-3 sticky bottom-0 bg-background pt-4 border-t border-border mt-6">
        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-gradient-primary hover:opacity-90 text-white shadow-lg shadow-primary/20"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Create Booking
        </Button>
      </div>
    </form>
  );
}
