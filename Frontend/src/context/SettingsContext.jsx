import { createContext, useContext, useState, useEffect } from 'react';
import { fetchSettings } from '../services/settingsService';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Add timestamp to prevent caching
        const data = await fetchSettings(`?t=${new Date().getTime()}`);
        setSettings(data);
      } catch (err) {
        console.error('Failed to load settings:', err);
        setError(err.message);
        // Fallback or retry logic could go here
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, error }}>
      {children}
    </SettingsContext.Provider>
  );
};
