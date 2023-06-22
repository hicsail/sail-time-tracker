import { FC, ReactNode } from 'react';
import TableHead from '@mui/material/TableHead';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: ReactNode | string;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    disablePadding: true,
    label: 'Name'
  },
  {
    id: 'email',
    disablePadding: true,
    label: 'Email'
  },
  {
    id: 'rate',
    disablePadding: false,
    label: 'Rate'
  },
  {
    id: 'status',
    disablePadding: false,
    label: 'Status'
  }
];

interface EnhancedTableProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
}

export const EnhancedTableHead: FC<EnhancedTableProps> = (props) => {
  const { onSelectAllClick, numSelected, rowCount } = props;

  return (
    <TableHead sx={{ width: '100%', height: '58px' }}>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox color="primary" indeterminate={numSelected > 0 && numSelected < rowCount} checked={rowCount > 0 && numSelected === rowCount} onChange={onSelectAllClick} />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align="left" padding={headCell.disablePadding ? 'none' : 'normal'} sx={{ color: 'grey.500', fontWeight: 'bold' }}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
