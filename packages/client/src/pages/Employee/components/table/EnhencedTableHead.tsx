import { ReactNode } from 'react';
import TableHead from '@mui/material/TableHead';
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
    disablePadding: false,
    label: 'Name'
  },
  {
    id: 'email',
    disablePadding: false,
    label: 'Email'
  },
  {
    id: 'status',
    disablePadding: false,
    label: 'Status'
  },
  {
    id: 'actions',
    disablePadding: false,
    label: 'Actions'
  }
];

export const EnhancedTableHead = () => {
  return (
    <TableHead sx={{ width: '100%', height: '58px' }}>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sx={{ color: 'grey.500', fontWeight: 'bold', bgcolor: 'grey.200', border: 'none' }}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
