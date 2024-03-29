import Dialog from '@mui/material/Dialog';
import { FC, ReactNode } from 'react';
import { CustomStyledFormDialog } from '@components/StyledComponent';

interface FormDialogProps {
  open: boolean;
  children: ReactNode;
  onClose: () => void;
}

export const FormDialog: FC<FormDialogProps> = ({ open, children, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <CustomStyledFormDialog>{children}</CustomStyledFormDialog>
    </Dialog>
  );
};
