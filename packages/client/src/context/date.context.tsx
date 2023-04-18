import { createContext, ReactNode, FC, useState, useContext } from 'react';

interface DateContextProps {
  date: Date;
  setDate: (date: Date) => void;
}

const DateContext = createContext<DateContextProps>({} as DateContextProps);

interface DateProviderProps {
  children: ReactNode;
}

export const DateProvider: FC<DateProviderProps> = ({ children }) => {
  const defaultDate = new Date();
  const [date, setDate] = useState(defaultDate);

  return <DateContext.Provider value={{ date, setDate }}>{children}</DateContext.Provider>;
};

export const useDate = () => {
  return useContext(DateContext);
};
