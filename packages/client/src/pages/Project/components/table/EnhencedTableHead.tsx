/**
 * This component is used to display table head (employee name, email, rate)
 * @param props
 */

import React, { FC } from 'react';
import TableHead from '@mui/material/TableHead';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { ProjectModel } from '@graphql/graphql';

interface HeadCell {
  disablePadding: boolean;
  id: keyof ProjectModel;
  label: string;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    disablePadding: true,
    label: 'Name'
  },
  {
    id: 'description',
    disablePadding: true,
    label: 'Description'
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
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox color="primary" indeterminate={numSelected > 0 && numSelected < rowCount} checked={rowCount > 0 && numSelected === rowCount} onChange={onSelectAllClick} />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align="left" padding={headCell.disablePadding ? 'none' : 'normal'} sx={{ color: 'grey.500', fontWeight: 'bold' }}>
            {headCell.label}
          </TableCell>
        ))}
        <TableCell key="edit" align="left" padding="none"></TableCell>
      </TableRow>
    </TableHead>
  );
};
