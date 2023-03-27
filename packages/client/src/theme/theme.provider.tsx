import React, { FC } from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { themeLight } from './theme.light';
import { themeDark } from './theme.dark';
import { useSettings } from '@context/setting.context';

export type ThemeType = 'light' | 'dark';

export interface ThemeProviderProps {
  children: React.ReactNode;
}

declare module '@mui/material/styles' {
  interface Palette {
    customColors: {
      listNavHoverColor: string;
      iconHoverColor: string;
      iconColor: string;
      sidebarBg: string;
      cardBg: string;
      cardTextTopColor: string;
      cardTextBottomColor: string;
      statusBtnBg: string;
      statusBtnText: string;
    };
  }

  interface PaletteOptions {
    customColors?: {
      listNavHoverColor?: string;
      iconHoverColor?: string;
      iconColor?: string;
      sidebarBg?: string;
      cardBg?: string;
      cardTextTopColor?: string;
      cardTextBottomColor?: string;
      statusBtnBg?: string;
      statusBtnText?: string;
    };
  }
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const { settings } = useSettings();

  const theme = settings.theme;

  const selectedTheme = theme === 'light' ? themeLight : themeDark;

  return (
    <MuiThemeProvider theme={selectedTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
