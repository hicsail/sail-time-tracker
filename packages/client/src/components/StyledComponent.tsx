import { alpha, Box, Button, Stack, styled, TextField } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';

export const DefaultTextInput = styled(TextField)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey['100'] : theme.palette.grey['700'],
  color: theme.palette.mode === 'light' ? theme.palette.grey['800'] : 'white',
  borderRadius: '8px',
  '& fieldset': { border: 'none' },
  '& input[type=number]': {
    '-moz-appearance': 'textfield'
  },
  '& input[type=number]::-webkit-outer-spin-button': {
    '-webkit-appearance': 'none',
    margin: 0
  },
  '& input[type=number]::-webkit-inner-spin-button': {
    '-webkit-appearance': 'none',
    margin: 0
  }
}));

export const DefaultContainedButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey['800'] : 'white',
  color: theme.palette.mode === 'light' ? 'white' : theme.palette.grey['800'],
  '&:hover': { backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey['700'] : theme.palette.grey['400'] }
}));

export const StyledTableBox = styled(Box)(({ theme }) => ({
  width: '100%',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow:
    theme.palette.mode === 'light'
      ? 'rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px'
      : 'rgba(0, 0, 0, 0.2) 0px 0px 2px 0px, rgba(0, 0, 0, 0.12) 0px 12px 24px -4px'
}));

export const CustomStyledFormDialog = styled(DialogContent)(({ theme }) => ({
  maxWidth: '600px',
  width: '600px',
  padding: '4rem',
  backgroundColor: theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.grey['800']
}));

// export const CustomTableHeadCover = styled(Stack)((props) => ({
//   top: 0,
//   left: 0,
//   height: '58px',
//   backgroundColor: `${alpha(props.theme.palette.primary.light, 0.8)}`,
//   width: '100%',
//   paddingLeft: 0.5
// }));
