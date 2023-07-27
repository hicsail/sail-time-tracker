import { createTheme } from '@mui/material';
import { themeBase } from './theme.base';

export const themeLight = createTheme({
  ...themeBase,
  palette: {
    mode: 'light',
    background: {
      default: 'rgb(249, 250, 251)'
    },
    primary: {
      light: '#757ce8',
      main: '#4A4ECC',
      dark: '#3d40ba',
      contrastText: 'white'
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
      dark: '#1d5329',
      contrastText: 'white'
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
    },
    grey: {
      100: 'rgb(249,250,251)',
      200: 'rgb(244,246,248)',
      300: 'rgb(223,227,232)',
      400: 'rgb(196,205,213)',
      500: 'rgb(145, 158, 171)',
      600: 'rgb(99, 115, 129)',
      700: 'rgb(69, 79, 91)',
      800: 'rgb(33,43,54)',
      900: 'rgb(22,28,36)'
    },
    green: {
      lighter: 'rgb(211, 252, 210)',
      light: 'rgb(119, 237, 139)',
      main: 'rgb(34, 197, 94)',
      dark: 'rgb(17, 141, 87)',
      darker: 'rgb(6, 94, 73)'
    }
  }
});
