import { CollapsibleTable, CollapsibleTableProps } from '@pages/Report/components/table/CollapsibleTable';
import React, { FC, useState } from 'react';
import TableCell from '@mui/material/TableCell';
import { TableSortLabel } from '@mui/material';

interface SortedCollapsibleTableProps extends CollapsibleTableProps {}

export const SortedCollapsibleTable: FC<SortedCollapsibleTableProps> = (props) => {
  const { tableConfig, rows } = props;
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('billableHours');

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

  tableConfig.outer = tableConfig.outer.map((column: any) => {
    if (!column.sortValue) {
      return column;
    }

    return {
      ...column,
      header: () => {
        return (
          <TableCell align="left">
            <TableSortLabel active={orderBy === column.id} direction={orderBy === column.id ? order : 'asc'} onClick={() => handleClick(column.id)}>
              {column.name}
            </TableSortLabel>
          </TableCell>
        );
      }
    };
  });

  let sortedData = rows;

  if (order && orderBy) {
    const { sortValue } = tableConfig.outer.find((column: any) => column.id === orderBy);
    sortedData = [...sortedData].sort((a: any, b: any) => {
      const valueA = sortValue(a);
      const valueB = sortValue(b);

      const reverseOrder = order === 'asc' ? 1 : -1;

      if (typeof valueA === 'string') {
        return valueA.localeCompare(valueB) * reverseOrder;
      } else {
        return (valueA - valueB) * reverseOrder;
      }
    });
  }

  return <CollapsibleTable {...props} tableConfig={...tableConfig} rows={sortedData} />;
};
