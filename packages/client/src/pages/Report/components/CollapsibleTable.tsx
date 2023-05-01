import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Row } from '@pages/Report/components/Row';
import { FC } from 'react';

interface CollapsibleTableProps {
  rows: any;
  outerHeaderRow: any;
  innerHeaderRow: any;
  rowsValuesConfigure: any;
}

export const CollapsibleTable: FC<CollapsibleTableProps> = ({ rows, outerHeaderRow, innerHeaderRow, rowsValuesConfigure }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            {outerHeaderRow.map((config: any) => {
              return (
                <TableCell key={config.name} align={config.align}>
                  {config.name}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: any) => (
            <Row key={row.name} row={row} innerHeader={innerHeaderRow} rowsValue={rowsValuesConfigure} innerTitle="Project" />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
