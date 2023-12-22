import { useEffect, useState } from 'react';
import { useDateRange } from '@context/reportFilter.context';
import { getMonth, getYear } from 'date-fns';

export const useIsEdit = () => {
  const [isEdit, setIsEdit] = useState(false);
  const { dateRange } = useDateRange();

  useEffect(() => {
    const { startDate, endDate } = dateRange;
    if (!startDate || !endDate) return;

    if (getYear(startDate) !== getYear(endDate) || getMonth(startDate) !== getMonth(endDate)) {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  }, [dateRange]);

  return { isEdit };
};
