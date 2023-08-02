import { Button, Checkbox, Stack, Tooltip, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { Delete } from '@mui/icons-material';
import { ChangeEvent, FC, useState } from 'react';
import { FormDialog } from '@components/form/FormDialog';

interface TableHeadCoverProps {
  rowCount: number;
  selected: readonly string[];
  setSelected: (select: readonly string[]) => void;
  handleSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClickDelete: () => void;
}

export const TableHeadCover: FC<TableHeadCoverProps> = ({ rowCount, selected, handleSelectAllClick, handleClickDelete, setSelected }) => {
  const numSelected = selected.length;
  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseFormDialog = () => {
    setOpenDialog(false);
    setSelected([]);
  };

  const handleUnFavoriteProject = () => {
    handleClickDelete();
    handleCloseFormDialog();
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      position="absolute"
      gap={6}
      sx={{
        top: 10,
        left: 0,
        height: '58px',
        backgroundColor: `primary.light`,
        width: '100%',
        paddingLeft: 0.5,
        zIndex: `${selected.length > 0 ? 10 : -10}`
      }}
    >
      <Checkbox indeterminate={numSelected > 0 && numSelected < rowCount} checked={numSelected > 0 && numSelected === rowCount} onChange={handleSelectAllClick} />
      <Typography sx={{ flex: '1 1 100%' }} color="primary" variant="subtitle2">
        {numSelected} selected
      </Typography>
      <Tooltip title={`Unfavorite ${numSelected} projects`}>
        <IconButton onClick={() => setOpenDialog(true)}>
          <Delete color="primary" />
        </IconButton>
      </Tooltip>
      <FormDialog open={openDialog} onClose={handleCloseFormDialog}>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Unfavorite
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Are you sure you want to unfavorite these projects?
        </Typography>
        <Stack direction="row" gap={2} justifyContent="end">
          <Button color="error" variant="contained" onClick={handleUnFavoriteProject}>
            unfavorite
          </Button>
          <Button color="secondary" variant="outlined" onClick={handleCloseFormDialog}>
            cancel
          </Button>
        </Stack>
      </FormDialog>
    </Stack>
  );
};
