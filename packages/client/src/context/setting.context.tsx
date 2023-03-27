import { ThemeType } from '@theme/theme.provider';
import { createContext, FC, useContext, useEffect, useState, ReactNode } from 'react';

export interface Settings {
  theme: ThemeType;
}

const defaultSettings: Settings = {
  theme: 'light'
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
  const [settings, setSettings] = useState(retrieveSetting());

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  return <SettingsContext.Provider value={{ settings, setSettings }}>{children}</SettingsContext.Provider>;
};

const saveSettings = (settings: Settings) => {
  localStorage.setItem('settings', JSON.stringify(settings));
};

const retrieveSetting = (): Settings => {
  const settings = localStorage.getItem('settings');
  return settings ? JSON.parse(settings) : defaultSettings;
};

export const useSettings = () => {
  return useContext(SettingsContext);
};
