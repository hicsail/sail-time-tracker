import { useFormikContext } from 'formik';
import { FC, useEffect } from 'react';
import { useAddRecordMutation } from '@graphql/record/record';
import { GetRecordWithFavoriteProjectDocument } from '@graphql/employee/employee';
import { endOfWeek, startOfWeek } from 'date-fns';
import { formatDateWithDash } from '../../../../utils/helperFun';

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
    const timeout = setTimeout(() => {
      if (typeof values[id] === 'number' && values[id] >= 0) {
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
                startDate: formatDateWithDash(startOfWeek(date, { weekStartsOn: 1 })),
                endDate: formatDateWithDash(endOfWeek(date, { weekStartsOn: 1 }))
              }
            }
          ]
        });
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [values]);

  return null;
};
