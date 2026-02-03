import { motion } from 'framer-motion';
import { Package, Building2, MessageSquare, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const quickActions = [
  {
    label: 'Create Package',
    description: 'Add a new travel package',
    icon: Package,
    path: '/packages/new',
    color: 'text-primary',
  },
  {
    label: 'Add Hotel',
    description: 'Register a new hotel',
    icon: Building2,
    path: '/hotels/new',
    color: 'text-success',
  },
  {
    label: 'View Inquiries',
    description: 'Check new messages',
    icon: MessageSquare,
    path: '/inquiries',
    color: 'text-warning',
  },
];

export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="chart-container"
    >
      <h3 className="text-lg font-semibold font-display text-foreground mb-4">Quick Actions</h3>
      <div className="grid gap-3">
        {quickActions.map((action, index) => (
          <Link key={action.label} to={action.path}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              className="quick-action group"
            >
              <div className={`p-2 rounded-lg bg-muted/50 group-hover:bg-primary/10 transition-colors ${action.color}`}>
                <action.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
              <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
