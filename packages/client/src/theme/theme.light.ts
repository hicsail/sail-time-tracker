import { createTheme } from '@mui/material';
import { themeBase } from './theme.base';

export const themeLight = createTheme({
  ...themeBase,
  palette: {
    mode: 'light',
    background: {
      default: '#f5f5f5'
    },
    primary: {
      light: '#757ce8',
      main: '#4A4ECC',
      dark: '#3d40ba',
      contrastText: '#fff'
    },
    secondary: {
      light: '#B6B3C3',
      main: '#767575',
      dark: '#262626',
      contrastText: '#fff'
    },
    success: {
      light: '#EAF8F1',
      main: '#1D7F54',
      dark: '#1d5329'
    },
    error: {
      light: '#FFE3EC',
      main: '#C6325E',
      dark: '#751e3a'
    },
    customColors: {
      listNavHoverColor: '#eef2ff',
      iconHoverColor: '#171717',
      iconColor: '#B6B3C3',
      sidebarBg: 'white',
      cardBg: 'white',
      cardTextTopColor: '#a3a3a3',
      cardTextBottomColor: '#525252',
      statusBtnBg: '#E9F5F5',
      statusBtnText: '#6E9596',
      interstellarBlue: '#021352'
    }
  }
});
