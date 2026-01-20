import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, MapPin, ArrowLeft, Loader2, Users, Phone, 
  MessageSquare, CreditCard, Clock, CheckCircle2, XCircle, Printer
} from "lucide-react";
import { Button } from "@/components/ui/forms";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = API_BASE.includes('/api') ? API_BASE : `${API_BASE.replace(/\/$/, "")}/api`;

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setBooking(data.booking);
      } else {
        toast.error("Failed to load booking details");
        navigate("/bookings");
      }
    } catch (error) {
      console.error("Booking fetch error:", error);
      toast.error("Error loading booking details");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "pending": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "cancelled": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "completed": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      default: return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
         <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      
      <main className="pt-24 md:pt-36 pb-12 min-h-screen bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8"
            >
              <Link to="/bookings" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Bookings
              </Link>
              <h1 className="text-3xl font-serif font-bold">Booking Details</h1>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                ID: <span className="font-mono bg-muted px-2 py-0.5 rounded text-xs">{booking._id}</span>
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Main Info */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="md:col-span-2 space-y-6"
              >
                {/* Header Card */}
                <div className="bg-search-gradient rounded-3xl p-6 md:p-8 text-primary-foreground relative overflow-hidden shadow-lg">
                   <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3 bg-white/20 backdrop-blur-sm border border-white/20 uppercase tracking-wider`}>
                           {booking.status}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">{booking.packageName}</h2>
                        <div className="flex items-center gap-4 text-primary-foreground/80 text-sm">
                            <span className="flex items-center gap-1.5 backdrop-blur-sm bg-black/10 px-2 py-1 rounded-md">
                                <Calendar className="w-4 h-4" />
                                {new Date(booking.tripDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                        </div>
                      </div>
                      <div className="text-left md:text-right bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                         <p className="text-sm opacity-80 mb-1">Total Amount</p>
                         <p className="text-3xl font-serif font-bold">₹{booking.totalPrice.toLocaleString()}</p>
                      </div>
                   </div>
                   
                   {/* Background decoration */}
                   <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                </div>

                {/* Details Card */}
                <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-border pb-4">
                        Trip Information
                    </h3>
                    
                    <div className="grid sm:grid-cols-2 gap-y-6 gap-x-12">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Travelers</p>
                            <div className="flex items-center gap-2 font-medium">
                                <Users className="w-4 h-4 text-primary" />
                                {booking.travelers} People
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Contact Number</p>
                            <div className="flex items-center gap-2 font-medium">
                                <Phone className="w-4 h-4 text-primary" />
                                {booking.contactPhone || "N/A"}
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Booking Date</p>
                            <div className="flex items-center gap-2 font-medium">
                                <Clock className="w-4 h-4 text-primary" />
                                {new Date(booking.createdAt).toLocaleString()}
                            </div>
                        </div>

                         <div>
                            <p className="text-sm text-muted-foreground mb-1">Payment Status</p>
                            <div className="flex items-center gap-2 font-medium capitalize">
                                <CreditCard className="w-4 h-4 text-primary" />
                                {booking.paymentStatus}
                            </div>
                        </div>
                    </div>

                    {booking.specialRequests && (
                        <div className="mt-8 pt-6 border-t border-border">
                            <p className="text-sm text-muted-foreground mb-2">Special Requests</p>
                            <div className="bg-muted/30 p-4 rounded-xl text-sm italic border border-border">
                                "{booking.specialRequests}"
                            </div>
                        </div>
                    )}
                </div>
              </motion.div>

              {/* Sidebar */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                 <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                    <img 
                        src={booking.packageImage || "/placeholder-image.jpg"} 
                        alt={booking.packageName}
                        className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                        <h4 className="font-bold mb-2">Need Help?</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                            Have questions about your booking? Our support team is here to help.
                        </p>
                        <Link to="/contact">
                            <Button variant="outline" className="w-full">Contact Support</Button>
                        </Link>
                    </div>
                 </div>

                 {booking.status === 'confirmed' && (
                     <Button variant="hero" className="w-full gap-2">
                         <Printer className="w-4 h-4" />
                         Download Invoice
                     </Button>
                 )}
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingDetail;
