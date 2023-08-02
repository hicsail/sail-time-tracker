import { CollapsibleTable, CollapsibleTableProps } from '@pages/Report/components/table/CollapsibleTable';
import { FC } from 'react';
import TableCell from '@mui/material/TableCell';
import { TableSortLabel } from '@mui/material';
import { useSort } from '../../../../hooks/useSort';

interface SortedCollapsibleTableProps extends CollapsibleTableProps {}

export const SortedCollapsibleTable: FC<SortedCollapsibleTableProps> = (props) => {
  const { tableConfig, rows } = props;
  const { order, orderBy, setSortColumn, sortedData } = useSort(rows, tableConfig.outer, 'billableHours');

  tableConfig.outer = tableConfig.outer.map((column: any) => {
    if (!column.sortValue) {
      return column;
    }

    return {
      ...column,
      header: () => {
        return (
          <TableCell align="left">
            <TableSortLabel active={orderBy === column.field} direction={orderBy === column.field ? order : 'asc'} onClick={() => setSortColumn(column.field)}>
              {column.name}
            </TableSortLabel>
          </TableCell>
        );
      }
    };
  });

  return <CollapsibleTable {...props} tableConfig={tableConfig} rows={sortedData} />;
};
