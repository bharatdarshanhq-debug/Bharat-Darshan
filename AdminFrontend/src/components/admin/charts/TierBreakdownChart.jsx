import { motion } from 'framer-motion';
import { bookingsByTier } from '@/data/mockData';

const tierColors = {
  Pro: 'bg-info',
  Premium: 'bg-primary',
  Elite: 'bg-accent',
};

const tierGradients = {
  Pro: 'from-info/20 to-info/5',
  Premium: 'from-primary/20 to-primary/5',
  Elite: 'from-accent/20 to-accent/5',
};

export function TierBreakdownChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="chart-container"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold font-display text-foreground">Tier Breakdown</h3>
        <p className="text-sm text-muted-foreground">Bookings by package tier</p>
      </div>
      
      <div className="space-y-4">
        {bookingsByTier.map((item, index) => (
          <motion.div
            key={item.tier}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
            className={`p-4 rounded-xl bg-gradient-to-r ${tierGradients[item.tier]}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground">{item.tier}</span>
              <span className="text-sm text-muted-foreground">{item.bookings} bookings</span>
            </div>
            <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ duration: 0.8, delay: 0.8 + index * 0.1, ease: 'easeOut' }}
                className={`h-full rounded-full ${tierColors[item.tier]}`}
              />
            </div>
            <div className="mt-1 text-right">
              <span className="text-sm font-semibold text-foreground">{item.percentage}%</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
