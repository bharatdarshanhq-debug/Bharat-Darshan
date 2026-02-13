import { motion } from 'framer-motion';
import { Settings, Bell, Shield, Database, Globe, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/Primitives';
import { Switch } from '@/components/ui/Primitives';
import { Label } from '@/components/ui/Primitives';
import { Separator } from '@/components/ui/Primitives';

const settingsGroups = [
  {
    title: 'Notifications',
    icon: Bell,
    description: 'Configure how you receive notifications',
    settings: [
      { id: 'email-bookings', label: 'Email for new bookings', enabled: true },
      { id: 'email-inquiries', label: 'Email for new inquiries', enabled: true },
      { id: 'email-payments', label: 'Email for payment updates', enabled: false },
      { id: 'browser-notifications', label: 'Browser notifications', enabled: true },
    ],
  },
  {
    title: 'Security',
    icon: Shield,
    description: 'Manage account security settings',
    settings: [
      { id: 'two-factor', label: 'Two-factor authentication', enabled: false },
      { id: 'session-timeout', label: 'Auto logout after inactivity', enabled: true },
    ],
  },
  {
    title: 'Website',
    icon: Globe,
    description: 'Control website display settings',
    settings: [
      { id: 'maintenance', label: 'Maintenance mode', enabled: false },
      { id: 'show-prices', label: 'Show package prices', enabled: true },
      { id: 'booking-enabled', label: 'Enable online booking', enabled: true },
    ],
  },
  {
    title: 'Payments',
    icon: CreditCard,
    description: 'Payment gateway configuration',
    settings: [
      { id: 'razorpay', label: 'Razorpay enabled', enabled: true },
      { id: 'test-mode', label: 'Test mode', enabled: false },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold font-serif text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your admin panel preferences</p>
      </motion.div>

      {/* Settings Groups */}
      <div className="space-y-6">
        {settingsGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + groupIndex * 0.1 }}
            className="bg-card rounded-xl border border-border/50 overflow-hidden"
          >
            <div className="p-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <group.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground font-serif">{group.title}</h2>
                  <p className="text-sm text-muted-foreground">{group.description}</p>
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-border/50">
              {group.settings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                  <Label htmlFor={setting.id} className="text-sm font-medium cursor-pointer">
                    {setting.label}
                  </Label>
                  <Switch id={setting.id} defaultChecked={setting.enabled} />
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Database Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card rounded-xl border border-border/50 p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-secondary/10">
            <Database className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground font-serif">Database</h2>
            <p className="text-sm text-muted-foreground">Manage database connections and backups</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button variant="outline">
            Export Data
          </Button>
          <Button variant="outline">
            Import Data
          </Button>
          <Button variant="outline" className="text-destructive hover:text-destructive">
            Clear Cache
          </Button>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex justify-end"
      >
        <Button className="bg-gradient-primary hover:opacity-90 text-white px-8">
          Save Changes
        </Button>
      </motion.div>
    </div>
  );
}

