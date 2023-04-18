import { useFormikContext } from 'formik';
import { FC, useEffect } from 'react';
import startOfWeek from 'date-fns/startOfWeek';
import { useAddRecordMutation } from '@graphql/record/record';

interface FormObserverProps {
  projectId: string;
  employeeId: string;
  date: Date;
  setLoading: (loading: boolean) => void;
}

interface FormValues {
  hours: number | string;
}

export const FormObserver: FC<FormObserverProps> = ({ projectId, employeeId, date, setLoading }) => {
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
    if (values.hours !== 0 && values.hours !== '') {
      addRecordMutation({
        variables: {
          record: {
            projectId: projectId,
            employeeId: employeeId,
            hours: values.hours as number,
            date: startOfWeek(date, { weekStartsOn: 1 })
          }
        }
      });
    }
  }, [values]);
  return null;
};
