import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Shield, Database, Globe, CreditCard, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Primitives';
import { Switch } from '@/components/ui/Primitives';
import { Label } from '@/components/ui/Primitives';
import { Separator } from '@/components/ui/Primitives';
import { toast } from 'sonner';
import { fetchSettings, updateSettings } from '@/services/settingsService';

const settingsGroups = [
  {
    title: 'Notifications',
    key: 'notifications',
    icon: Bell,
    description: 'Configure how you receive notifications',
    settings: [
      { id: 'emailBookings', label: 'Email for new bookings' },
      { id: 'emailInquiries', label: 'Email for new inquiries' },
      { id: 'emailPayments', label: 'Email for payment updates' },
      { id: 'browserNotifications', label: 'Browser notifications' },
    ],
  },
  {
    title: 'Security',
    key: 'security',
    icon: Shield,
    description: 'Manage account security settings',
    settings: [
      { id: 'twoFactor', label: 'Two-factor authentication' },
      { id: 'sessionTimeout', label: 'Auto logout after inactivity' },
    ],
  },
  {
    title: 'Website',
    key: 'website',
    icon: Globe,
    description: 'Control website display settings',
    settings: [
      { id: 'maintenance', label: 'Maintenance mode' },
      { id: 'showPrices', label: 'Show package prices' },
      { id: 'bookingEnabled', label: 'Enable online booking' },
    ],
  },
  {
    title: 'Payments',
    key: 'payments',
    icon: CreditCard,
    description: 'Payment gateway configuration',
    settings: [
      { id: 'razorpay', label: 'Razorpay enabled' },
      { id: 'testMode', label: 'Test mode' },
    ],
  },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await fetchSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (groupKey, settingId, value) => {
    setSettings(prev => ({
      ...prev,
      [groupKey]: {
        ...prev[groupKey],
        [settingId]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Remove mongoose timestamps and id if present, though backend usually ignores extra fields
      const { _id, createdAt, updatedAt, __v, ...dataToSave } = settings;
      await updateSettings(dataToSave);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-start"
      >
        <div>
           <h1 className="text-3xl font-bold font-serif text-foreground">Settings</h1>
           <p className="text-muted-foreground mt-1">Manage your admin panel preferences</p>
        </div>
        <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-primary hover:bg-primary/90 text-white gap-2"
        >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
        </Button>
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
                  <Label htmlFor={`${group.key}-${setting.id}`} className="text-sm font-medium cursor-pointer flex-1">
                    {setting.label}
                  </Label>
                  <Switch 
                    id={`${group.key}-${setting.id}`} 
                    checked={settings?.[group.key]?.[setting.id] ?? false} 
                    onCheckedChange={(checked) => handleToggle(group.key, setting.id, checked)}
                  />
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

      {/* Bottom Save Button (Redundant but good for UX on long pages) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex justify-end pt-4"
      >
        <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-primary hover:bg-primary/90 text-white px-8 gap-2"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
      </motion.div>
    </div>
  );
}

