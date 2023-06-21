import { createTheme } from '@mui/material';
import { themeBase } from './theme.base';

export const themeDark = createTheme({
  ...themeBase,
  palette: {
    mode: 'dark',
    background: {
      default: '#161C24'
    },
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff'
    },
    secondary: {
      light: '#B6B3C3',
      main: '#767575',
      dark: '#262626',
      contrastText: '#fff'
    },
    success: {
      light: '#2A4947',
      main: '#5da49f',
      dark: ''
    },
    error: {
      light: '#8B3B3D',
      main: '#dd8e94',
      dark: ''
    },
    customColors: {
      iconHoverColor: '#64ffda',
      iconColor: '#ccd6f6',
      sidebarBg: '#171C22',
      cardBg: '#171C22',
      cardTextTopColor: '#a3a3a3',
      cardTextBottomColor: 'white'
    },
    grey: {
      100: '#F9FAFB',
      200: '#F4F6F8',
      300: '#DFE3E8',
      400: '#C4CDD5',
      500: '#919EAB',
      600: '#637381',
      700: '#454F5B',
      800: '#212B36',
      900: '#161C24'
    }
  }
});
