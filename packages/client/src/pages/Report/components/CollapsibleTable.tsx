import { Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer } from '@mui/material';
import { Row } from '@pages/Report/components/Row';
import { FC } from 'react';

interface CollapsibleTableProps {
  rows: any;
  outerTableConfig: any;
  innerTableConfig: any;
}

export const CollapsibleTable: FC<CollapsibleTableProps> = ({ rows, outerTableConfig, innerTableConfig }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            {outerTableConfig.map((config: any) => {
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
            <Row key={row.name} row={row} innerTableConfig={innerTableConfig} innerTitle="Project" outerTableConfig={outerTableConfig} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
