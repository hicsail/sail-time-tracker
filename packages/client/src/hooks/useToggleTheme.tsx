import { useSettings } from '@context/setting.context';

export const useToggleTheme = () => {
  const { settings, setSettings } = useSettings();
  const toggleTheme = () => (settings.theme === 'light' ? setSettings({ theme: 'dark' }) : setSettings({ theme: 'light' }));

  return { toggleTheme };
};
