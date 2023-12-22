import { alpha, Box, Button, styled, TextareaAutosize, TextField } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import TableRow from '@mui/material/TableRow';

export const DefaultTextInput = styled(TextField)(({ theme, variant }) => ({
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: variant === 'outlined' ? theme.palette.grey['800'] : theme.palette.grey['700'],
    color: theme.palette.grey['800'],
    '& fieldset': { border: variant === 'outlined' ? `1px solid ${theme.palette.grey[700]}` : 'none' }
  }),
  ...(theme.palette.mode === 'light' && {
    backgroundColor: variant === 'outlined' ? theme.palette.common.white : theme.palette.grey['100'],
    color: variant === 'outlined' ? theme.palette.grey['800'] : theme.palette.grey['800'],
    '& fieldset': { border: variant === 'outlined' ? `1px solid ${theme.palette.grey[300]}` : 'none' }
  }),
  borderRadius: '8px',
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
  minWidth: '600px',
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

export const StyledTextarea = styled(TextareaAutosize)(({ theme }) => ({
  width: '100%',
  height: '200px',
  fontWeight: 'medium',
  lineHeight: 1.5,
  padding: '12px',
  borderRadius: '10px',
  color: theme.palette.mode === 'light' ? theme.palette.grey['900'] : theme.palette.common.white,
  backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey['100'] : theme.palette.grey['800'],
  border: `1px solid ${theme.palette.mode === 'light' ? theme.palette.grey['400'] : theme.palette.grey['700']}`,
  resize: 'none',
  fontFamily: 'Rubik, sans-serif',
  '&:hover': {
    borderColor: theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white
  },
  '&:focus': {
    outline: `2px solid ${theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white}`
  }
}));

export const StyledTableHeadRow = styled(TableRow)(({ theme }) => ({
  '& .MuiTableCell-root': {
    color: theme.palette.mode === 'light' ? theme.palette.grey[600] : theme.palette.grey[500],
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[200] : alpha(theme.palette.grey[500], 0.12),
    fontWeight: 'medium',
    border: 'none'
  }
}));

export const StyledTableDataRow = styled(TableRow)(({ theme }) => ({
  '& .MuiTableCell-root': {
    borderBottom: '1px dashed',
    borderColor: theme.palette.mode === 'light' ? theme.palette.grey[200] : 'rgb(46, 50, 54)',
    padding: 4
  },
  '&:hover': { backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[100] : alpha(theme.palette.grey[500], 0.08) }
}));

interface StyledNestedTableDataRowProps {
  open: boolean;
}

export const StyledNestedTableDataRow = styled(TableRow, { shouldForwardProp: (prop) => prop !== 'open' })<StyledNestedTableDataRowProps>(({ open, theme }) => ({
  ...(theme.palette.mode === 'light' && {
    backgroundColor: open ? theme.palette.grey[200] : 'inherit'
  }),
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: open ? alpha(theme.palette.grey[500], 0.12) : 'inherit'
  })
}));
