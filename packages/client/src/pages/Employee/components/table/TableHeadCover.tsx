import { Checkbox, Stack, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { Delete } from '@mui/icons-material';
import { ChangeEvent, FC } from 'react';

interface TableHeadCoverProps {
  rowCount: number;
  selected: readonly string[];
  setSelected: (select: readonly string[]) => void;
  handleSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClickDelete: () => void;
}

export const TableHeadCover: FC<TableHeadCoverProps> = ({ rowCount, selected, handleSelectAllClick, handleClickDelete }) => {
  const numSelected = selected.length;

  return (
    <Stack
      direction="row"
      alignItems="center"
      position="absolute"
      gap={6}
      sx={{
        top: 0,
        left: 0,
        height: '58px',
        backgroundColor: 'primary.light',
        width: '100%',
        zIndex: `${selected.length > 0 ? 10 : -10}`,
        paddingLeft: 0.5
      }}
    >
      <Checkbox color="primary" indeterminate={numSelected > 0 && numSelected < rowCount} checked={numSelected > 0 && numSelected === rowCount} onChange={handleSelectAllClick} />
      <Typography sx={{ flex: '1 1 100%' }} color="primary" variant="subtitle2">
        {numSelected} selected
      </Typography>
      <IconButton onClick={handleClickDelete}>
        <Delete color="primary" />
      </IconButton>
    </Stack>
  );
};
