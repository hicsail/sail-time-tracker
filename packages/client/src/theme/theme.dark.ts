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
      lighter: 'rgb(209, 233, 252)',
      light: 'rgb(118, 176, 241)',
      main: 'rgb(32, 101, 209)',
      dark: 'rgb(16, 57, 150)',
      darker: 'rgb(6, 27, 100)'
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
    warning: {
      lighter: 'rgb(255, 245, 204)',
      light: 'rgb(255, 214, 102)',
      main: 'rgb(255, 171, 0)',
      dark: 'rgb(183, 110, 0)',
      darker: 'rgb(122, 65, 0)'
    },
    info: {
      lighter: 'rgb(202, 253, 245)',
      light: 'rgb(97, 243, 243)',
      main: 'rgb( 0, 184, 217)',
      dark: 'rgb(0, 108, 156)',
      darker: 'rgb(0, 55, 104)'
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
