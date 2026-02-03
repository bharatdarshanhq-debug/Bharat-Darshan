import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'text-primary',
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="stat-card bg-card"
    >
      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold font-display text-foreground">{value}</p>
          {change && (
            <p
              className={cn(
                'text-sm font-medium',
                changeType === 'positive' && 'text-success',
                changeType === 'negative' && 'text-destructive',
                changeType === 'neutral' && 'text-muted-foreground'
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div
          className={cn(
            'p-3 rounded-xl bg-gradient-to-br shadow-lg',
            iconColor === 'text-primary' && 'from-primary/20 to-primary/5',
            iconColor === 'text-success' && 'from-success/20 to-success/5',
            iconColor === 'text-warning' && 'from-warning/20 to-warning/5',
            iconColor === 'text-info' && 'from-info/20 to-info/5',
            iconColor === 'text-secondary' && 'from-secondary/20 to-secondary/5'
          )}
        >
          <Icon className={cn('h-6 w-6', iconColor)} />
        </div>
      </div>
    </motion.div>
  );
}
