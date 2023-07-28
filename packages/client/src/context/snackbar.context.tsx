import React, { createContext, FC, ReactNode, useContext, useState } from 'react';
import { AlertColor, Snackbar } from '@mui/material';
import { Alert } from '@mui/lab';

const SnackbarContext = createContext<SnackBarContextProps>({} as SnackBarContextProps);

interface SnackBarProviderProps {
  children: ReactNode;
}

interface SnackBarContextProps {
  toggleSnackBar: (message: string, { variant }: { variant: AlertColor }) => void;
  handleSnackBarOpen: () => void;
}

export const SnackBarProvider: FC<SnackBarProviderProps> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [variant, setVariant] = useState<AlertColor>('success');

  const handleSnackBarClose = () => setOpen(false);
  const handleSnackBarOpen = () => setOpen(true);

  const toggleSnackBar = (message: string, { variant }: { variant: AlertColor }) => {
    handleSnackBarOpen();
    setMessage(message);
    setVariant(variant);
  };

  return (
    <SnackbarContext.Provider value={{ handleSnackBarOpen, toggleSnackBar }}>
      {children}
      <Snackbar open={open} autoHideDuration={2000} onClose={handleSnackBarClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert
          onClose={handleSnackBarClose}
          severity={variant}
          sx={{ fontWeight: 'medium', backgroundColor: variant === 'success' ? 'green.dark' : '', color: variant === 'success' ? 'white' : '' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackBar = () => useContext(SnackbarContext);
