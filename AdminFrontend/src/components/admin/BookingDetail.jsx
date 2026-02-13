import { Calendar, Users, IndianRupee, MapPin, Phone, Mail, Building2 } from 'lucide-react';
import { Badge, Button, Separator, Textarea, Label } from '@/components/ui/Primitives';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Interactive';

const statusColors = {
  pending: 'badge-pending',
  confirmed: 'badge-confirmed',
  cancelled: 'badge-cancelled',
  completed: 'badge-completed',
};

const paymentStatusColors = {
  pending: 'bg-warning/15 text-warning',
  paid: 'bg-success/15 text-success',
  refunded: 'bg-info/15 text-info',
  failed: 'bg-destructive/15 text-destructive',
};

const tierColors = {
  Lite: 'bg-green-500/15 text-green-600',
  Standard: 'bg-blue-500/15 text-blue-600',
  Pro: 'bg-info/15 text-info',
  Premium: 'bg-primary/15 text-primary',
  Elite: 'bg-accent/15 text-accent-foreground',
};

export function BookingDetail({ booking }) {
  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-muted-foreground">Booking ID</span>
          <h3 className="text-xl font-bold text-foreground">{booking.id}</h3>
        </div>
        <div className="flex gap-2">
          <Badge className={`badge-status ${statusColors[booking.status]}`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
          <Badge className={paymentStatusColors[booking.paymentStatus]}>
            {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
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
              <p className="text-lg font-medium text-foreground">{booking.customerName}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${booking.customerEmail}`} className="hover:text-primary">
                {booking.customerEmail}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <a href={`tel:${booking.customerPhone}`} className="hover:text-primary">
                {booking.customerPhone}
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
              <Badge className={tierColors[booking.tier]}>{booking.tier}</Badge>
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
                ₹{booking.totalPrice.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Selected Hotels */}
      {booking.selectedHotels && booking.selectedHotels.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Selected Hotels
          </h4>
          <div className="flex flex-wrap gap-2">
            {booking.selectedHotels.map((hotelId) => (
              <Badge key={hotelId} variant="outline" className="py-1">
                Hotel ID: {hotelId}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {booking.notes && (
        <div className="space-y-2">
          <h4 className="font-semibold text-foreground">Notes</h4>
          <p className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg">
            {booking.notes}
          </p>
        </div>
      )}

      <Separator />

      {/* Actions */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground">Update Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Booking Status</Label>
            <Select defaultValue={booking.status}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Payment Status</Label>
            <Select defaultValue={booking.paymentStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="internalNotes">Internal Notes</Label>
          <Textarea
            id="internalNotes"
            placeholder="Add internal notes about this booking..."
            defaultValue={booking.notes}
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-gradient-primary hover:opacity-90 text-white">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
