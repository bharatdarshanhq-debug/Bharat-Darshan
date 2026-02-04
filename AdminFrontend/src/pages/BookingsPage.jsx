import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Eye,
  MoreVertical,
  Calendar,
  Users,
  IndianRupee,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/Primitives';
import { Input } from '@/components/ui/Primitives';
import { Badge } from '@/components/ui/Primitives';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Interactive';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/Interactive';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Layout';
import { mockBookings } from '@/data/mockData';
import { BookingDetail } from '@/components/admin/BookingDetail';
import { BookingForm } from '@/components/admin/forms/BookingForm';

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

export default function BookingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isAddBookingOpen, setIsAddBookingOpen] = useState(false);

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch = 
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.packageName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Bookings</h1>
          <p className="text-muted-foreground mt-1">Manage customer bookings</p>
        </div>
        <Button 
          className="bg-gradient-primary text-white shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
          onClick={() => setIsAddBookingOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Booking
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID, customer, or package..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Bookings Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-xl border border-border/50 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Package</th>
                <th>Trip Date</th>
                <th>Travelers</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking, index) => (
                <motion.tr
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.03 }}
                >
                  <td>
                    <span className="font-medium text-foreground">{booking.id}</span>
                  </td>
                  <td>
                    <div>
                      <p className="font-medium text-foreground">{booking.customerName}</p>
                      <p className="text-xs text-muted-foreground">{booking.customerEmail}</p>
                    </div>
                  </td>
                  <td>
                    <div>
                      <p className="font-medium text-foreground line-clamp-1">{booking.packageName}</p>
                      <p className="text-xs text-muted-foreground">{booking.destination}</p>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(booking.tripDate).toLocaleDateString('en-IN', { 
                        day: 'numeric', month: 'short', year: 'numeric' 
                      })}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.travelers}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1 font-semibold text-foreground">
                      <IndianRupee className="h-4 w-4" />
                      {booking.totalPrice.toLocaleString('en-IN')}
                    </div>
                  </td>
                  <td>
                    <Badge className={`badge-status ${statusColors[booking.status]}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </td>
                  <td>
                    <Badge className={paymentStatusColors[booking.paymentStatus]}>
                      {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                    </Badge>
                  </td>
                  <td>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          className="cursor-pointer"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">
                          Mark as Confirmed
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          Mark as Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-destructive">
                          Cancel Booking
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No bookings found.</p>
          </div>
        )}
      </motion.div>

      {/* Booking Detail Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Booking Details</DialogTitle>
            <DialogDescription>View and manage booking information</DialogDescription>
          </DialogHeader>
          {selectedBooking && <BookingDetail booking={selectedBooking} />}
        </DialogContent>
      </Dialog>
      
      {/* Add Booking Dialog */}
      <Dialog open={isAddBookingOpen} onOpenChange={setIsAddBookingOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
           <DialogHeader>
            <DialogTitle className="font-display text-xl">Create Manual Booking</DialogTitle>
            <DialogDescription>Enter customer and trip details to create a new booking.</DialogDescription>
          </DialogHeader>
          <BookingForm onClose={() => setIsAddBookingOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
