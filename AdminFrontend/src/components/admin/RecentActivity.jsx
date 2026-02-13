import { motion } from 'framer-motion';
import { CalendarCheck, MessageSquare, CreditCard, CheckCircle } from 'lucide-react';
import { recentActivity } from '@/data/mockData';
import { cn } from '@/lib/utils';

const getActivityIcon = (type) => {
  switch (type) {
    case 'booking':
      return CalendarCheck;
    case 'inquiry':
      return MessageSquare;
    case 'payment':
      return CreditCard;
    default:
      return CheckCircle;
  }
};

const getActivityColor = (type) => {
  switch (type) {
    case 'booking':
      return 'text-primary bg-primary/10';
    case 'inquiry':
      return 'text-warning bg-warning/10';
    case 'payment':
      return 'text-success bg-success/10';
    default:
      return 'text-info bg-info/10';
  }
};

export function RecentActivity({ data }) {
  const activityData = data || [];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="chart-container"
    >
      <h3 className="text-lg font-semibold font-display text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activityData.map((activity, index) => {
          const Icon = getActivityIcon(activity.type);
          const colorClass = getActivityColor(activity.type);
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className="flex items-start gap-3"
            >
              <div className={cn('p-2 rounded-lg shrink-0', colorClass)}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground line-clamp-2">{activity.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
