import React, { createContext, useContext, useEffect, useState } from 'react';

interface Config {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

interface ConfigContextType {
  config: Config | null;
  loading: boolean;
  error: string | null;
}

const ConfigContext = createContext<ConfigContextType>({
  config: null,
  loading: true,
  error: null
});

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider');
  }
  return context;
};

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        // First check if we have client-side environment variables
        const clientUrl = import.meta.env.VITE_SUPABASE_URL;
        const clientKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (clientUrl && clientKey) {
          setConfig({ supabaseUrl: clientUrl, supabaseAnonKey: clientKey });
          setLoading(false);
          return;
        }

        // Fallback to server-side config
        const response = await fetch('/api/config');
        if (!response.ok) {
          throw new Error('Failed to fetch config');
        }
        
        const serverConfig = await response.json();
        if (!serverConfig.supabaseUrl || !serverConfig.supabaseAnonKey) {
          throw new Error('Missing Supabase configuration');
        }
        
        setConfig(serverConfig);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load configuration');
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, loading, error }}>
      {children}
    </ConfigContext.Provider>
  );
};