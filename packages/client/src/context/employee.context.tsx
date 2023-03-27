import { createContext, ReactNode, FC, useState, useContext, useEffect } from 'react';
import { useSettings } from '@context/setting.context';

interface EmployeeContextProps {
  employeeId: string | null;
  setEmployeeId: (id: string) => void;
}

const EmployeeContext = createContext<EmployeeContextProps>({} as EmployeeContextProps);

interface EmployeeProviderProps {
  children: ReactNode;
}

export const EmployeeProvider: FC<EmployeeProviderProps> = ({ children }) => {
  const { settings, setSettings } = useSettings();
  const defaultEmployee = settings.employee ? settings.employee : null;
  const [employeeId, setEmployeeId] = useState(defaultEmployee);

  useEffect(() => {
    setSettings({ ...settings, employee: employeeId });
  }, [employeeId]);

  return <EmployeeContext.Provider value={{ employeeId, setEmployeeId }}>{children}</EmployeeContext.Provider>;
};

export const useEmployee = () => {
  return useContext(EmployeeContext);
};
