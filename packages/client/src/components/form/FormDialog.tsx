import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FC, ReactNode } from 'react';

interface FormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export const FormDialog: FC<FormDialogProps> = ({ open, setOpen, title, children, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ margin: 'auto' }}>{title}</DialogTitle>
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
