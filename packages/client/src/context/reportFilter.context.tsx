import { createContext, ReactNode, FC, useState, useContext } from 'react';
import { lastDayOfMonth } from 'date-fns';

interface DateRangeContextProps {
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
  setDateRange: (date: any) => void;
  groupBy: string;
  setGroupBy: (groupBy: string) => void;
}

const ReportFilterContext = createContext<DateRangeContextProps>({} as DateRangeContextProps);

interface DateProviderProps {
  children: ReactNode;
}

export const DateRangeProvider: FC<DateProviderProps> = ({ children }) => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [dateRange, setDateRange] = useState({ startDate: firstDayOfMonth, endDate: lastDayOfMonth(today) });
  const [groupBy, setGroupBy] = useState<string>('1');

  return <ReportFilterContext.Provider value={{ dateRange, setDateRange, groupBy, setGroupBy }}>{children}</ReportFilterContext.Provider>;
};

export const useDateRange = () => {
  return useContext(ReportFilterContext);
};
