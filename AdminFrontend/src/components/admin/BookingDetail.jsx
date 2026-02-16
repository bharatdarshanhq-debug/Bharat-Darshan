import { useState } from 'react';
import { Calendar, Users, IndianRupee, MapPin, Phone, Mail, Building2, Loader2, AlertTriangle, Clock, RefreshCcw } from 'lucide-react';
import { Badge } from '@/components/ui/Primitives';
import { Button } from '@/components/ui/Primitives';
import { Separator } from '@/components/ui/Primitives';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  sonnerToast as toast,
} from '@/components/ui/Interactive';
import { Textarea } from '@/components/ui/Primitives';
import { Label } from '@/components/ui/Primitives';

const statusColors = {
  pending: 'badge-pending',
  confirmed: 'badge-confirmed',
  cancelled: 'badge-cancelled',
  cancellation_requested: 'bg-orange-500/15 text-orange-600',
  completed: 'badge-completed',
};

const statusLabels = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  cancellation_requested: 'Cancel Requested',
  completed: 'Completed',
};

const paymentStatusColors = {
  pending: 'badge-pending',
  partial: 'badge-pending',
  paid: 'badge-confirmed',
  refunded: 'badge-cancelled',
  partially_refunded: 'bg-purple-500/15 text-purple-600',
};

const tierColors = {
  Lite: 'badge-pending',
  Standard: 'badge-confirmed',
  Premium: 'badge-completed',
};

export function BookingDetail({ booking, onStatusUpdate, onClose }) {
  const [bookingStatus, setBookingStatus] = useState(booking.status);
  const [paymentStatus, setPaymentStatus] = useState(booking.paymentStatus || 'pending');
  const [saving, setSaving] = useState(false);

  const hasChanges = bookingStatus !== booking.status || paymentStatus !== (booking.paymentStatus || 'pending');

  const handleSave = async () => {
    if (!hasChanges) return;
    setSaving(true);
    try {
      if (onStatusUpdate) {
        await onStatusUpdate(booking._id, {
          status: bookingStatus,
          paymentStatus: paymentStatus,
        });
      }
      toast.success('Booking updated successfully');
    } catch (error) {
      toast.error('Failed to update booking');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setBookingStatus(booking.status);
    setPaymentStatus(booking.paymentStatus || 'pending');
    if (onClose) onClose();
  };

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-muted-foreground">Booking ID</span>
          <h3 className="text-xl font-bold text-primary font-mono">{booking.bookingId || booking._id}</h3>
        </div>
        <div className="flex gap-2">
          <Badge className={`badge-status ${statusColors[booking.status]}`}>
            {statusLabels[booking.status] || booking.status}
          </Badge>
          <Badge className={paymentStatusColors[booking.paymentStatus || 'pending']}>
            {(booking.paymentStatus || 'pending').charAt(0).toUpperCase() + (booking.paymentStatus || 'pending').slice(1).replace('_', ' ')}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Customer Details</h4>
          <div className="space-y-3">
            <div>
              <p className="text-lg font-medium text-foreground">{booking.user?.name || booking.contactName || 'Guest'}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${booking.user?.email || booking.contactEmail || ''}`} className="hover:text-primary">
                {booking.user?.email || booking.contactEmail || '-'}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <a href={`tel:${booking.contactPhone || ''}`} className="hover:text-primary">
                {booking.contactPhone || '-'}
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Trip Details</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{booking.packageName}</span>
              {booking.tier && <Badge className={tierColors[booking.tier]}>{booking.tier}</Badge>}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(booking.tripDate).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{booking.travelers} Travelers</span>
            </div>
            <div className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
              <span className="text-lg font-bold text-foreground">
                ₹{(booking.totalPrice || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hotels */}
      {booking.selectedHotels?.length > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Selected Hotels</h4>
            <div className="space-y-2">
              {booking.selectedHotels.map((hotel, index) => (
                <div key={hotel.hotelId || index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium text-foreground">{hotel.hotelName}</span>
                  <span className="text-xs">({hotel.city})</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Cancellation & Refund Info */}
      {(booking.status === 'cancellation_requested' || booking.status === 'cancelled') && (
        <>
          <Separator />
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Cancellation & Refund Details
            </h4>
            <div className={`rounded-lg border-2 p-4 space-y-3 ${
              booking.status === 'cancellation_requested' 
                ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800'
                : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
            }`}>
              {booking.cancellationReason && (
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Reason</span>
                  <p className="text-sm text-foreground">{booking.cancellationReason}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {booking.cancelledBy && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Initiated By</span>
                    <p className="text-foreground capitalize">{booking.cancelledBy}</p>
                  </div>
                )}
                {booking.cancellationRequestedAt && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Requested</span>
                    <p className="text-foreground">{new Date(booking.cancellationRequestedAt).toLocaleString()}</p>
                  </div>
                )}
                {booking.cancelledAt && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Cancelled At</span>
                    <p className="text-foreground">{new Date(booking.cancelledAt).toLocaleString()}</p>
                  </div>
                )}
              </div>

              {/* Refund info */}
              {(booking.refundAmount > 0 || booking.refundStatus !== 'none') && (
                <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <RefreshCcw className="h-4 w-4 text-primary" />
                    Refund Information
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-xs text-muted-foreground">Amount</span>
                      <p className="font-bold text-green-600">₹{(booking.refundAmount || 0).toLocaleString()} ({booking.refundPercentage || 0}%)</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Status</span>
                      <p className={`font-semibold capitalize ${
                        booking.refundStatus === 'completed' ? 'text-green-600' :
                        booking.refundStatus === 'processing' ? 'text-blue-600' :
                        booking.refundStatus === 'failed' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {booking.refundStatus || 'none'}
                      </p>
                    </div>
                    {booking.refundId && (
                      <div className="col-span-2">
                        <span className="text-xs text-muted-foreground">Refund ID</span>
                        <p className="font-mono text-xs text-foreground">{booking.refundId}</p>
                      </div>
                    )}
                    {booking.refundProcessedAt && (
                      <div>
                        <span className="text-xs text-muted-foreground">Processed</span>
                        <p className="text-foreground">{new Date(booking.refundProcessedAt).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {booking.adminNotes && (
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Admin Notes</span>
                  <p className="text-sm text-foreground italic">{booking.adminNotes}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <Separator />

      {/* Actions */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground">Update Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Booking Status</Label>
            <Select value={bookingStatus} onValueChange={setBookingStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancellation_requested">Cancel Requested</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Payment Status</Label>
            <Select value={paymentStatus} onValueChange={setPaymentStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
                <SelectItem value="partially_refunded">Partially Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="internalNotes">Special Requests</Label>
          <Textarea
            id="internalNotes"
            placeholder="No special requests"
            defaultValue={booking.specialRequests || ''}
            rows={3}
            readOnly
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button 
            className="bg-gradient-primary hover:opacity-90 text-white"
            onClick={handleSave}
            disabled={!hasChanges || saving}
          >
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
