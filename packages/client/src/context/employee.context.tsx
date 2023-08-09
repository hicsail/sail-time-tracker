import { createContext, ReactNode, FC, useState, useContext, useEffect } from 'react';
import { useSettings } from '@context/setting.context';
import { useAuth } from '@summerluna/harbor';
import { useGetEmployeeIdQuery } from '@graphql/employee/employee';

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
  const { data } = useGetEmployeeIdQuery();
  const { token } = useAuth();

  useEffect(() => {
    setSettings({ ...settings, employee: employeeId });
  }, [employeeId]);

  useEffect(() => {
    if (data && token) {
      setEmployeeId(data.me);
    }
  }, [data]);

  return (
    <EmployeeContext.Provider
      value={{
        employeeId,
        setEmployeeId
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployee = () => {
  return useContext(EmployeeContext);
};
