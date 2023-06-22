/**
 * This component is used to display table name, adding button, and selected rows
 * @param props
 */

import React, { FC, useState } from 'react';
import { alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { FormDialog } from '@components/form/FormDialog';
import { useEmployee } from '@context/employee.context';
import { useDeleteFavoriteProjectMutation } from '@graphql/favoriteProject/favoriteProject';
import { GetRecordWithFavoriteProjectDocument } from '@graphql/employee/employee';
import { useDate } from '@context/date.context';
import { startOfWeek } from 'date-fns';
import { CheckboxesSearch } from '@pages/Track/components/form/CheckboxesSearch';
import { Paths } from '@constants/paths';
import { useNavigate } from 'react-router-dom';

interface EnhancedTableToolbarProps {
  numSelected: number;
  selected: readonly string[];
  setSelected: (select: readonly string[]) => void;
}

export const EnhancedTableToolbar: FC<EnhancedTableToolbarProps> = ({ numSelected, selected, setSelected }) => {
  const [open, setOpen] = useState(false);
  const [deleteFavoriteProject, { error }] = useDeleteFavoriteProjectMutation();
  const { employeeId } = useEmployee();
  const { date } = useDate();
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  // close Model and navigate to Track Page
  const handleClose = () => {
    setOpen(false);
    navigate(Paths.TRACK);
  };

  // handle delete on or more favorite project
  const handleOnClickDelete = async () => {
    if (employeeId && selected.length > 0) {
      deleteFavoriteProject({
        variables: {
          employeeId: employeeId,
          projectIds: selected as string[]
        },
        refetchQueries: [
          {
            query: GetRecordWithFavoriteProjectDocument,
            variables: {
              id: employeeId,
              date: startOfWeek(date, { weekStartsOn: 1 })
            }
          }
        ]
      });
    }

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
          Favorite Projects
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="unfavorite">
          <IconButton onClick={handleOnClickDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <>
          <IconButton
            onClick={handleClickOpen}
            sx={{
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white'
              }
            }}
          >
            <AddIcon />
          </IconButton>
          <FormDialog open={open} onClose={handleClose}>
            <CheckboxesSearch />
          </FormDialog>
        </>
      )}
      <div>{error && <div>{error.message}</div>}</div>
    </Toolbar>
  );
};
