/**
 * This component is used to display table head (project name, hours, previous week, description)
 * @param props
 */

import React from 'react';
import TableHead from '@mui/material/TableHead';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Typography } from '@mui/material';

interface EnhancedTableProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
  dates: { dateOfMonth: string; dateOfWeek: string }[];
}

export const EnhancedTableHead = (props: EnhancedTableProps) => {
  const { onSelectAllClick, numSelected, rowCount, dates } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox color="primary" indeterminate={numSelected > 0 && numSelected < rowCount} checked={rowCount > 0 && numSelected === rowCount} onChange={onSelectAllClick} />
        </TableCell>
        <TableCell key="projectName" align="left" padding="normal" sx={{ width: '150px' }}>
          Project Name
        </TableCell>
        {dates.map((dateValue) => (
          <TableCell key={dateValue.dateOfMonth} align="left" padding="normal">
            <Typography>{dateValue.dateOfWeek}</Typography>
            <Typography>{dateValue.dateOfMonth}</Typography>
          </TableCell>
        ))}
        <TableCell key="totalHours" align="left" padding="normal" sx={{ width: '150px' }}>
          Total Hours
        </TableCell>
        <TableCell key="description" align="left" padding="normal">
          Description
        </TableCell>
      </TableRow>
    </TableHead>
  );
};
