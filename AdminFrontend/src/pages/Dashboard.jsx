import { motion } from 'framer-motion';
import {
  CalendarCheck,
  Clock,
  CheckCircle,
  MessageSquare,
  Building2,
  IndianRupee,
  TrendingUp,
  Package,
  MapPin,
} from 'lucide-react';
import { StatCard } from '@/components/admin/StatCard';
import { RecentActivity } from '@/components/admin/RecentActivity';
import { BookingsChart } from '@/components/admin/charts/BookingsChart';
import { RevenueChart } from '@/components/admin/charts/RevenueChart';
import { DestinationChart } from '@/components/admin/charts/DestinationChart';
import { TierBreakdownChart } from '@/components/admin/charts/TierBreakdownChart';
import { mockDashboardStats } from '@/data/mockData';

const formatCurrency = (value) => {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  return `₹${(value / 1000).toFixed(0)}K`;
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold font-display text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your business overview.</p>
      </motion.div>

      {/* Stats Grid */}
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Bookings"
          value={mockDashboardStats.totalBookings}
          change="+12% from last month"
          changeType="positive"
          icon={CalendarCheck}
          iconColor="text-primary"
          delay={0}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(mockDashboardStats.totalRevenue)}
          change="+18% YoY"
          changeType="positive"
          icon={IndianRupee}
          iconColor="text-success"
          delay={0.1}
        />
        <StatCard
          title="This Month Revenue"
          value={formatCurrency(mockDashboardStats.monthlyRevenue)}
          change="+5% from last month"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-primary"
          delay={0.2}
        />
        <StatCard
          title="Active Packages"
          value={mockDashboardStats.activePackages}
          change="3 new this month"
          changeType="neutral"
          icon={Package}
          iconColor="text-secondary"
          delay={0.3}
        />
        <StatCard
          title="Active Destinations"
          value={mockDashboardStats.activeDestinations}
          change="All regions covered"
          changeType="neutral"
          icon={MapPin}
          iconColor="text-info"
          delay={0.4}
        />
        <StatCard
          title="Active Hotels"
          value={mockDashboardStats.activeHotels}
          change="Premium partnerships"
          changeType="neutral"
          icon={Building2}
          iconColor="text-warning"
          delay={0.5}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BookingsChart />
        <RevenueChart />
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DestinationChart />
        <TierBreakdownChart />
      </div>

      {/* Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        
        {/* Upcoming Trips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="chart-container"
        >
          <h3 className="text-lg font-semibold font-display text-foreground mb-4">Upcoming Trips</h3>
          <div className="space-y-3">
            {[
              { id: 'BK001', customer: 'Rahul Sharma', package: 'Golden Triangle', date: 'Feb 15, 2024', travelers: 4 },
              { id: 'BK002', customer: 'Priya Patel', package: 'Kerala Backwaters', date: 'Feb 20, 2024', travelers: 2 },
              { id: 'BK003', customer: 'Amit Kumar', package: 'Rajasthan Heritage', date: 'Mar 01, 2024', travelers: 6 },
            ].map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm text-foreground">{trip.customer}</p>
                  <p className="text-xs text-muted-foreground">{trip.package}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{trip.date}</p>
                  <p className="text-xs text-muted-foreground">{trip.travelers} travelers</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
