import { useFormikContext } from 'formik';
import { FC, useEffect, useRef } from 'react';
import { useAddRecordMutation } from '@graphql/record/record';

interface FormObserverProps {
  projectId: string;
  employeeId: string;
  setLoading: (loading: boolean) => void;
  id: string;
}

interface FormValues {
  [id: string]: number | string;
}

export const FormObserver: FC<FormObserverProps> = ({ projectId, employeeId, setLoading, id }) => {
  const { values } = useFormikContext<FormValues>();
  const [addRecordMutation, { loading }] = useAddRecordMutation();
  const valueRef = useRef(values);

  useEffect(() => {
    if (loading) {
      setLoading(loading);
    } else {
      setTimeout(() => {
        setLoading(loading);
      }, 200);
    }
  }, [loading]);

  useEffect(() => {
    if (typeof values[id] === 'number' && values[id] >= 0) {
      if (values[id] === valueRef.current[id]) return;

      const timeId = setTimeout(() => {
        addRecordMutation({
          variables: {
            record: {
              projectId: projectId,
              employeeId: employeeId,
              hours: values[id] as number,
              date: id
            }
          }
        });
      }, 1000);

      valueRef.current = values;

      return () => clearTimeout(timeId);
    }
  }, [values]);

  return null;
};
