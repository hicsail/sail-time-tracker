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
import { FormDialog } from '@pages/Project/components/form/FormDialog';
import AddIcon from '@mui/icons-material/Add';
import { useDeleteProjectsMutation, GetProjectListDocument } from '@graphql/project/project';

interface EnhancedTableToolbarProps {
  numSelected: number;
  selected: readonly string[];
  setSelected: (select: readonly string[]) => void;
}

export const EnhancedTableToolbar: FC<EnhancedTableToolbarProps> = ({ numSelected, selected, setSelected }) => {
  const [open, setOpen] = useState(false);
  const [deleteProjects, { data, loading, error }] = useDeleteProjectsMutation();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickDelete = async () => {
    await deleteProjects({
      variables: {
        ids: selected as string[]
      },
      refetchQueries: [{ query: GetProjectListDocument }]
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
          All Projects
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={handleClickDelete}>
            <DeleteIcon />
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
            <AddIcon />
          </IconButton>
          <FormDialog open={open} setOpen={setOpen} title="Add Project" />
        </>
      )}
    </Toolbar>
  );
};
