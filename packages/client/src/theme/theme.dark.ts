import { createTheme } from '@mui/material';
import { themeBase } from './theme.base';

export const themeDark = createTheme({
  ...themeBase,
  palette: {
    mode: 'dark',
    background: {
      default: '#0E1115'
    },
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff'
    },
    customColors: {
      iconHoverColor: '#64ffda',
      iconColor: '#ccd6f6',
      sidebarBg: '#171C22',
      cardBg: '#171C22',
      cardTextTopColor: '#a3a3a3',
      cardTextBottomColor: 'white',
      statusBtnBg: '#2A4947',
      statusBtnText: '#5da49f'
    }
  }
});
