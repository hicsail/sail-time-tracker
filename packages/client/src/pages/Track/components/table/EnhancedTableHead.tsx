/**
 * This component is used to display table head (project name, hours, previous week, description)
 * @param props
 */

import React from 'react';
import TableHead from '@mui/material/TableHead';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Data } from '@pages/Track/components/table/ProjectTable';

export interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    disablePadding: true,
    label: 'Project Name'
  },
  {
    id: 'hours',
    disablePadding: true,
    label: 'Hours'
  },
  {
    id: 'previousWeek',
    disablePadding: true,
    label: 'Previous Week'
  },
  {
    id: 'description',
    disablePadding: false,
    label: 'Description'
  }
];

interface EnhancedTableProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
}

export const EnhancedTableHead = (props: EnhancedTableProps) => {
  const { onSelectAllClick, numSelected, rowCount } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox color="primary" indeterminate={numSelected > 0 && numSelected < rowCount} checked={rowCount > 0 && numSelected === rowCount - 2} onChange={onSelectAllClick} />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align="left" padding={headCell.disablePadding ? 'none' : 'normal'}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
