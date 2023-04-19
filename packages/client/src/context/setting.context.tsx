import { ThemeType } from '@theme/theme.provider';
import { createContext, FC, useContext, useEffect, useState, ReactNode } from 'react';

export interface Settings {
  theme: ThemeType;
  employee?: string | null;
  VITE_BACKEND_URL?: string;
}

const defaultSettings: Settings = {
  theme: 'light',
  VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL
};

export interface SettingsContextProps {
  settings: Settings;
  setSettings: (settings: Settings) => void;
}

const SettingsContext = createContext<SettingsContextProps>({} as SettingsContextProps);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState({ ...defaultSettings });

  useEffect(() => {
    restoreSetting().then((settings) => setSettings(settings));
  }, []);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  return <SettingsContext.Provider value={{ settings, setSettings }}>{children}</SettingsContext.Provider>;
};

const saveSettings = (settings: Settings) => {
  localStorage.setItem('settings', JSON.stringify(settings));
};

const restoreSetting = async (): Promise<Settings> => {
  let storedSettings = localStorage.getItem('settings');
  let settings = storedSettings && { ...defaultSettings, ...JSON.parse(storedSettings) };

  try {
    const response = await fetch('/env.json');
    const env = await response.json();
    settings = { ...settings, ...env };
  } catch (e) {
    console.error(e);
  }

  return settings;
};

export const useSettings = () => {
  return useContext(SettingsContext);
};
