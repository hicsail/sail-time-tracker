import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { FC, ReactNode } from 'react';

interface FormDialogProps {
  open: boolean;
  children: ReactNode;
  onClose: () => void;
}

export const FormDialog: FC<FormDialogProps> = ({ open, children, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent
        sx={{
          maxWidth: '600px',
          width: '600px',
          padding: '4rem'
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};
