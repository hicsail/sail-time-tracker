import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    disablePadding: false,
    label: 'Name'
  },
  {
    id: 'description',
    disablePadding: false,
    label: 'Description'
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
  },
  {
    id: 'isBillable',
    disablePadding: false,
    label: 'isBillable'
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
