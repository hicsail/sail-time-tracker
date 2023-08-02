import { useState } from 'react';
import { compareAsc } from 'date-fns';

export const useSort = (data: any[], config: any[], defaultOrderBy: any) => {
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>(defaultOrderBy);

  const setSortColumn = (field: string) => {
    if (orderBy && orderBy !== field) {
      setOrder('asc');
      setOrderBy(field);
      return;
    }

    if (order === 'asc') {
      setOrder('desc');
    } else if (order === 'desc') {
      setOrder('asc');
    }

    setOrderBy(field);
  };

  let sortedData = data;

  if (order && orderBy) {
    const { sortValue } = config.find((column: any) => column.field === orderBy);
    sortedData = [...sortedData].sort((a: any, b: any) => {
      const valueA = sortValue(a);
      const valueB = sortValue(b);

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

  return { order, orderBy, setSortColumn, sortedData };
};
