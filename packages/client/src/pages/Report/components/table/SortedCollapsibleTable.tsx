import { CollapsibleTable, CollapsibleTableProps } from '@pages/Report/components/table/CollapsibleTable';
import React, { FC, useState } from 'react';
import TableCell from '@mui/material/TableCell';
import { TableSortLabel } from '@mui/material';

interface SortedCollapsibleTableProps extends CollapsibleTableProps {}

export const SortedCollapsibleTable: FC<SortedCollapsibleTableProps> = (props) => {
  const { tableConfig } = props;
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('billableHours');

  const handleClick = (id: string) => {
    if (order === 'asc') {
      setOrder('desc');
      setOrderBy(id);
    } else if (order === 'desc') {
      setOrderBy(id);
      setOrder('asc');
    }
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
            <TableSortLabel onClick={() => handleClick(column.id)}>{column.name}</TableSortLabel>
          </TableCell>
        );
      }
    };
  });

  return <CollapsibleTable {...props} tableConfig={...tableConfig} />;
};
