import { useFormikContext } from 'formik';
import { FC, useEffect } from 'react';
import startOfWeek from 'date-fns/startOfWeek';
import { useAddRecordMutation } from '@graphql/record/record';
import { EmployeeModel, ProjectModel } from '@graphql/graphql';

interface FormObserverProps {
  project: ProjectModel;
  employee: EmployeeModel;
  date: Date;
  setLoading: (loading: boolean) => void;
}

interface FormValues {
  hours: number | string;
}

export const FormObserver: FC<FormObserverProps> = ({ project, employee, date, setLoading }) => {
  const { values } = useFormikContext<FormValues>();
  const [addRecordMutation, { loading }] = useAddRecordMutation();

  // set loading button state
  useEffect(() => {
    if (loading) {
      setLoading(loading);
    } else {
      setTimeout(() => {
        setLoading(loading);
      }, 300);
    }
  }, [loading]);

  useEffect(() => {
    if (values.hours !== '') {
      addRecordMutation({
        variables: {
          record: {
            project: {
              id: project.id,
              name: project.name,
              description: project.description,
              status: project.status
            },
            employee: {
              id: employee.id,
              name: employee.name,
              email: employee.email,
              rate: employee.rate,
              status: employee.status
            },
            hours: values.hours as number,
            date: startOfWeek(date, { weekStartsOn: 1 })
          }
        }
      });
    }
  }, [values]);
  return null;
};
