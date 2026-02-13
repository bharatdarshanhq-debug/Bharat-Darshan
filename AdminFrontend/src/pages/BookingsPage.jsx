import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Eye,
  MoreVertical,
  Calendar,
  Users,
  IndianRupee,
  Plus,
  Loader2,
  Filter
} from 'lucide-react';
import { Button, Input, Badge } from '@/components/ui/Primitives';
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
import { BookingDetail } from '@/components/admin/BookingDetail';
import { BookingForm } from '@/components/admin/forms/BookingForm';
import { getAllBookings, updateBookingStatus, deleteBooking } from '@/services/bookingService';
import { sonnerToast as toast } from '@/components/ui/Interactive';

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
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isAddBookingOpen, setIsAddBookingOpen] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getAllBookings(pagination.page, pagination.limit);
      setBookings(data.bookings);
      setPagination(prev => ({ ...prev, total: data.count, pages: data.pages }));
    } catch (error) {
      toast.error(error.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [pagination.page]); // Refetch when page changes

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateBookingStatus(id, { status: newStatus });
      toast.success(`Booking marked as ${newStatus}`);
      fetchBookings(); // Refresh list
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      try {
        await deleteBooking(id);
        toast.success('Booking deleted successfully');
        fetchBookings();
      } catch (error) {
        toast.error('Failed to delete booking');
      }
    }
  };

  const handleBookingCreated = () => {
    setIsAddBookingOpen(false);
    fetchBookings();
    toast.success('Booking created successfully');
  };

  const filteredBookings = bookings.filter((booking) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      (booking.user?.name || booking.contactName || 'Guest')?.toLowerCase().includes(searchLower) ||
      booking._id.toLowerCase().includes(searchLower) ||
      booking.packageName.toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
             <Filter className="w-4 h-4 mr-2" />
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
                  key={booking._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.03 }}
                >
                  <td>
                    <span className="font-medium text-foreground text-xs font-mono">
                      {booking._id.substring(0, 8)}...
                    </span>
                  </td>
                  <td>
                    <div>
                      <p className="font-medium text-foreground">{booking.user?.name || booking.contactName || 'Guest'}</p>
                      <p className="text-xs text-muted-foreground">{booking.user?.email || booking.contactEmail || '-'}</p>
                    </div>
                  </td>
                  <td>
                    <div>
                      <p className="font-medium text-foreground line-clamp-1">{booking.packageName}</p>
                      <p className="text-xs text-muted-foreground">{booking.selectedHotels?.length ? `${booking.selectedHotels.length} Hotels` : 'No Hotels'}</p>
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
                      {booking.totalPrice?.toLocaleString('en-IN')}
                    </div>
                  </td>
                  <td>
                    <Badge className={`badge-status ${statusColors[booking.status]}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </td>
                  <td>
                    <Badge className={paymentStatusColors[booking.paymentStatus || 'pending']}>
                      {(booking.paymentStatus || 'pending').charAt(0).toUpperCase() + (booking.paymentStatus || 'pending').slice(1)}
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
                        
                        {booking.status !== 'confirmed' && (
                           <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                          >
                            Mark as Confirmed
                          </DropdownMenuItem>
                        )}
                        
                        {booking.status === 'confirmed' && (
                           <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => handleStatusUpdate(booking._id, 'completed')}
                          >
                            Mark as Completed
                          </DropdownMenuItem>
                        )}

                        {booking.status !== 'cancelled' && (
                           <DropdownMenuItem 
                             className="cursor-pointer text-destructive"
                             onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                           >
                             Cancel Booking
                           </DropdownMenuItem>
                        )}
                         
                         <DropdownMenuSeparator />
                         <DropdownMenuItem 
                           className="cursor-pointer text-destructive focus:bg-destructive/10"
                           onClick={() => handleDelete(booking._id)}
                         >
                            Delete Permanently
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
          <BookingForm onClose={() => setIsAddBookingOpen(false)} onSuccess={handleBookingCreated} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
