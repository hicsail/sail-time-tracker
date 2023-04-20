import { ThemeType } from '@theme/theme.provider';
import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';

export interface Settings {
  theme: ThemeType;
  employee?: string | null;
  VITE_BACKEND_URL?: string;
}

const defaultSettings: Settings = {
  theme: 'light',
  VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
  employee: ''
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
  const initialSettings = restoreSetting() ? restoreSetting() : defaultSettings;
  const [settings, setSettings] = useState(initialSettings);

  useEffect(() => {
    restoreSettingInProduction().then((settings) => setSettings(settings));
  }, []);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  return <SettingsContext.Provider value={{ settings, setSettings }}>{children}</SettingsContext.Provider>;
};

const saveSettings = (settings: Settings) => {
  localStorage.setItem('settings', JSON.stringify(settings));
};

// get settings from local storage
const restoreSetting = (): Settings => {
  let storedSettings = localStorage.getItem('settings');
  return storedSettings && { ...defaultSettings, ...JSON.parse(storedSettings) };
};

// get settings from env.json
const restoreSettingInProduction = async (): Promise<Settings> => {
  let settings = restoreSetting();

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
