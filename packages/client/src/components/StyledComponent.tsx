import { Box, Button, styled, TextField } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import TextareaAutosize from '@mui/base/TextareaAutosize';

export const DefaultTextInput = styled(TextField)(({ theme, variant }) => ({
  backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey['100'] : theme.palette.grey['700'],
  color: theme.palette.mode === 'light' ? theme.palette.grey['800'] : 'white',
  borderRadius: '8px',
  '& fieldset': { border: variant === 'outlined' ? `1px solid ${theme.palette.grey[300]}` : 'none' },
  '& input[type=number]': {
    MozAppearance: 'textfield'
  },
  '& input[type=number]::-webkit-outer-spin-button': {
    WebkitAppearance: 'none',
    margin: 0
  },
  '& input[type=number]::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0
  }
}));

export const CustomOutlinedTextInput = styled(TextField)(({ theme }) => ({
  ...(theme.palette.mode === 'dark' && {
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: 'white'
      }
    },
    '& label.Mui-focused': {
      color: 'white'
    }
  }),
  ...(theme.palette.mode === 'light' && {
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.grey['800']
      }
    },
    '& label.Mui-focused': {
      color: theme.palette.grey['800']
    }
  })
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

export const DefaultOutlinedButton = styled(Button)(({ theme }) => ({
  ...(theme.palette.mode === 'light' && {
    color: theme.palette.common.black,
    borderColor: theme.palette.grey['300'],
    '&:hover': {
      backgroundColor: theme.palette.grey['200'],
      borderColor: theme.palette.grey['700']
    }
  }),
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.common.white,
    borderColor: theme.palette.grey['700'],
    '&:hover': {
      backgroundColor: theme.palette.grey['700'],
      borderColor: theme.palette.grey['100']
    }
  })
}));

export const StyledTextarea = styled(TextareaAutosize)(
  ({ theme }) => `
    width: 100%;
    height: 200px;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 12px;
    border-radius: 10px;
    color: ${theme.palette.mode === 'dark' ? theme.palette.grey['300'] : theme.palette.grey['900']};
    background: ${theme.palette.mode === 'dark' ? theme.palette.grey['900'] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? theme.palette.grey['700'] : theme.palette.grey['100']};
    resize: none;
    font-family: 'Roboto', sans-serif;
    
    &:hover {
      border-color: black;
    }
    
    &:focus {
      border-color: black;
      outline: 1.5px solid black;
    }
  `
);
