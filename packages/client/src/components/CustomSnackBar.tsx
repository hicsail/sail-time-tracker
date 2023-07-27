import { Alert } from '@mui/lab';
import { Snackbar } from '@mui/material';
import { FC, ReactNode } from 'react';

interface CustomSnackBarProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  state: boolean;
}

export const CustomSnackBar: FC<CustomSnackBarProps> = ({ open, onClose, state, children }) => {
  return (
    <Snackbar open={open} autoHideDuration={2000} onClose={onClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <Alert onClose={onClose} severity={state ? 'success' : 'error'}>
        {children}
      </Alert>
    </Snackbar>
  );
};
