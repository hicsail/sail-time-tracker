import { FC } from 'react';
import TableCell from '@mui/material/TableCell';
import { TableSortLabel } from '@mui/material';
import { BasicTable, BasicTableProps } from '@components/table/BasicTable';
import { useSort } from '../../hooks/useSort';

interface SortedBasicTableProps extends BasicTableProps {
  defaultOrderBy: string;
}

export const SortedBasicTable: FC<SortedBasicTableProps> = (props) => {
  const { columns, rows, defaultOrderBy } = props;
  const { order, orderBy, setSortColumn, sortedData } = useSort(rows, columns, defaultOrderBy);

  const updatedColumns: any[] = columns.map((column: any) => {
    if (!column.sortValue) {
      return column;
    }

    return {
      ...column,
      header: () => {
        return (
          <TableCell align="left" sx={{ width: column.width ? column.width : '150px' }}>
            <TableSortLabel active={orderBy === column.field} direction={orderBy === column.field ? order : 'asc'} onClick={() => setSortColumn(column.field)}>
              {column.headerName}
            </TableSortLabel>
          </TableCell>
        );
      }
    };
  });

  return <BasicTable {...props} columns={updatedColumns} rows={sortedData} />;
};
