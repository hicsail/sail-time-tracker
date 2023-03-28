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
      main: '#737373',
      dark: '#262626',
      contrastText: '#fff'
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
      statusBtnText: '#6E9596'
    }
  }
});
