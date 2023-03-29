import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { EmployeeForm } from '@pages/Employee/components/form/EmployeeForm';
import { FC } from 'react';
import { Paths } from '@constants/paths';
import { useNavigate } from 'react-router-dom';

interface FormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
}

export const FormDialog: FC<FormDialogProps> = ({ open, setOpen, title }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);

    // reset to Employee List Router after close model
    navigate(Paths.EMPLOYEE_lIST);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ margin: 'auto' }}>{title}</DialogTitle>
        <DialogContent
          sx={{
            maxWidth: '600px',
            width: '600px',
            padding: '4rem'
          }}
        >
          <EmployeeForm handleClose={handleClose} />
        </DialogContent>
      </Dialog>
    </>
  );
};
