import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import { FC, useState } from 'react';
import { Paths } from '@constants/paths';
import { useNavigate } from 'react-router-dom';
import { ProjectForm } from '@pages/Project/components/form/ProjectForm';

interface FormDialogProps {
  type: 'add' | 'edit';
  path?: string;
}

export const FormDialog: FC<FormDialogProps> = ({ type, path }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);

    // reset to Employee List Router after close model
    navigate(Paths.PROJECT_lIST);
  };

  return (
    <>
      {type === 'add' ? (
        <IconButton
          onClick={() => {
            handleClickOpen();
          }}
          sx={{
            '&:hover': {
              backgroundColor: '#1565c0',
              color: 'white'
            }
          }}
        >
          <AddIcon />
        </IconButton>
      ) : (
        <Button
          variant="outlined"
          onClick={() => {
            path && navigate(path);
            handleClickOpen();
          }}
        >
          Edit
        </Button>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ margin: 'auto' }}>{type === 'add' ? 'Add New Project' : 'Edit Project'}</DialogTitle>
        <DialogContent
          sx={{
            maxWidth: '600px',
            width: '600px',
            padding: '4rem'
          }}
        >
          <ProjectForm handleClose={handleClose} />
        </DialogContent>
      </Dialog>
    </>
  );
};
