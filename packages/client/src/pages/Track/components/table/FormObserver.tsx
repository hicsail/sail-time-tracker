import { useFormikContext } from 'formik';
import { FC, useEffect, useRef } from 'react';
import { useAddRecordMutation } from '@graphql/record/record';
import { GetRecordWithFavoriteProjectDocument } from '@graphql/employee/employee';
import { endOfWeek, startOfWeek } from 'date-fns';
import { formatDateToDashFormat } from '../../../../utils/helperFun';

interface FormObserverProps {
  projectId: string;
  employeeId: string;
  date: Date;
  setLoading: (loading: boolean) => void;
  id: string;
}

interface FormValues {
  [id: string]: number | string;
}

export const FormObserver: FC<FormObserverProps> = ({ projectId, employeeId, date, setLoading, id }) => {
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
          },
          refetchQueries: [
            {
              query: GetRecordWithFavoriteProjectDocument,
              variables: {
                id: employeeId as string,
                startDate: formatDateToDashFormat(startOfWeek(date, { weekStartsOn: 1 })),
                endDate: formatDateToDashFormat(endOfWeek(date, { weekStartsOn: 1 }))
              }
            }
          ]
        });
      }, 1000);

      valueRef.current = values;

      return () => clearTimeout(timeId);
    }
  }, [values]);

  return null;
};
