import { Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer } from '@mui/material';
import { Row } from '@pages/Report/components/table/Row';
import { FC } from 'react';

interface CollapsibleTableProps {
  rows: any;
  outerTableConfig: any;
  innerTableConfig: any;
  innerTitle: string;
}

export const CollapsibleTable: FC<CollapsibleTableProps> = ({ rows, outerTableConfig, innerTableConfig, innerTitle }) => {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'customColors.sidebarBg' }}>
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
            <Row key={row.id} row={row} innerTableConfig={innerTableConfig} innerTitle={innerTitle} outerTableConfig={outerTableConfig} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
