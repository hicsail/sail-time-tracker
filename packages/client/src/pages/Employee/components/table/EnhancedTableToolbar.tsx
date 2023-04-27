/**
 * This component is used to display table name, adding button, and selected rows
 * @param props
 */

import { FC, useState } from 'react';
import { alpha } from '@mui/material/styles';
import { Typography, Toolbar, IconButton, Tooltip } from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { GetEmployeeListDocument, useDeleteEmployeesMutation } from '@graphql/employee/employee';

import { FormDialog } from '@components/form/FormDialog';
import { EmployeeForm } from '@pages/Employee/components/form/EmployeeForm';
import { Paths } from '@constants/paths';

interface EnhancedTableToolbarProps {
  numSelected: number;
  selected: readonly string[];
  setSelected: (select: readonly string[]) => void;
}

export const EnhancedTableToolbar: FC<EnhancedTableToolbarProps> = ({ numSelected, selected, setSelected }) => {
  const [open, setOpen] = useState(false);
  const [deleteEmployees] = useDeleteEmployeesMutation();
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  /**
   * close Model and navigate to Employee List Page
   */
  const handleClose = () => {
    setOpen(false);
    navigate(Paths.EMPLOYEE_lIST);
  };

  /**
   * delete one or more employees
   */
  const handleClickDelete = async () => {
    await deleteEmployees({
      variables: {
        ids: selected as string[]
      },
      refetchQueries: [{ query: GetEmployeeListDocument }]
    });
    setSelected([]);
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
          All Employees
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={handleClickDelete}>
            <Delete />
          </IconButton>
        </Tooltip>
      ) : (
        <>
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
            <Add />
          </IconButton>
          <FormDialog open={open} title="Add Employee" onClose={handleClose}>
            <EmployeeForm handleClose={handleClose} />
          </FormDialog>
        </>
      )}
    </Toolbar>
  );
};
