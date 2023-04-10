import { createContext, ReactNode, FC, useState, useContext, useEffect } from 'react';
import { useSettings } from '@context/setting.context';
import { GetEmployeeByIdDocument, GetEmployeeListDocument } from '@graphql/employee/employee';
import { ApolloError, useQuery } from '@apollo/client';

interface EmployeeContextProps {
  employeeId: string | null;
  setEmployeeId: (id: string) => void;
  employeeData: any;
  employeeLoading: boolean;
  employeeError: ApolloError | undefined;
  employeeListData: any;
  employeeListLoading: boolean;
  employeeListError: ApolloError | undefined;
}

const EmployeeContext = createContext<EmployeeContextProps>({} as EmployeeContextProps);

interface EmployeeProviderProps {
  children: ReactNode;
}

export const EmployeeProvider: FC<EmployeeProviderProps> = ({ children }) => {
  const { settings, setSettings } = useSettings();
  const defaultEmployee = settings.employee ? settings.employee : null;
  const [employeeId, setEmployeeId] = useState(defaultEmployee);
  const {
    data: employeeData,
    loading: employeeLoading,
    error: employeeError
  } = useQuery(GetEmployeeByIdDocument, {
    variables: {
      id: employeeId
    }
  });
  const { data: employeeListData, loading: employeeListLoading, error: employeeListError } = useQuery(GetEmployeeListDocument);

  useEffect(() => {
    setSettings({ ...settings, employee: employeeId });
  }, [employeeId]);

  return (
    <EmployeeContext.Provider
      value={{
        employeeId,
        setEmployeeId,
        employeeData,
        employeeLoading,
        employeeError,
        employeeListData,
        employeeListLoading,
        employeeListError
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployee = () => {
  return useContext(EmployeeContext);
};
