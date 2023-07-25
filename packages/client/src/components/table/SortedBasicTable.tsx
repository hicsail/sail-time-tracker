import React, { FC, useState } from 'react';
import TableCell from '@mui/material/TableCell';
import { TableSortLabel } from '@mui/material';
import { BasicTable, BasicTableProps } from '@components/table/BasicTable';
import { compareAsc } from 'date-fns';

interface SortedBasicTableProps extends BasicTableProps {}

export const SortedBasicTable: FC<SortedBasicTableProps> = (props) => {
  const { columns, rows } = props;
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string | null>(null);

  const handleClick = (id: string) => {
    if (orderBy && orderBy !== id) {
      setOrder('asc');
      setOrderBy(id);
      return;
    }

    if (order === 'asc') {
      setOrder('desc');
    } else if (order === 'desc') {
      setOrder('asc');
    }

    setOrderBy(id);
  };

  const updatedColumns: any[] = columns.map((column: any) => {
    if (!column.sortValue) {
      return column;
    }

    return {
      ...column,
      header: () => {
        return (
          <TableCell align="left" sx={{ width: column.width ? column.width : '150px', color: 'grey.600', fontWeight: 'medium', bgcolor: 'grey.200', border: 'none' }}>
            <TableSortLabel active={orderBy === column.field} direction={orderBy === column.field ? order : 'asc'} onClick={() => handleClick(column.field)}>
              {column.headerName}
            </TableSortLabel>
          </TableCell>
        );
      }
    };
  });

  let sortedData = rows;

  if (order && orderBy) {
    const { sortValue } = columns.find((column: any) => column.field === orderBy);
    sortedData = [...sortedData].sort((a: any, b: any) => {
      const valueA = sortValue(a);
      const valueB = sortValue(b);

      console.log(typeof valueA + ' => ' + valueB);

      const reverseOrder = order === 'asc' ? 1 : -1;

      if (typeof valueA === 'string') {
        return valueA.localeCompare(valueB) * reverseOrder;
      } else if (valueA instanceof Date) {
        return compareAsc(valueA, valueB) * reverseOrder;
      } else {
        return (valueA - valueB) * reverseOrder;
      }
    });
  }

  return <BasicTable {...props} columns={updatedColumns} rows={sortedData} />;
};
