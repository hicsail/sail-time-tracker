import { FormObserver } from '@components/form/FormObserver';
import { useAddRecordMutation } from '@graphql/record/record';
import { FC, useEffect } from 'react';
import { GetRecordWithFavoriteProjectDocument } from '@graphql/employee/employee';
import { formatDateToDashFormat } from '../../../../utils/helperFun';
import { endOfWeek, startOfWeek } from 'date-fns';

interface TrackFormObserverProps {
  id: string;
  projectId: string;
  employeeId: string;
  setLoading: (loading: boolean) => void;
  date: Date;
}

export const TrackFormObserver: FC<TrackFormObserverProps> = (props) => {
  const [addRecordMutation, { loading }] = useAddRecordMutation();
  const { id, projectId, employeeId, setLoading, date } = props;

  useEffect(() => {
    setLoading(loading);
  }, [loading]);

  const handleOnChange = (value: number) => {
    addRecordMutation({
      variables: {
        record: {
          projectId: projectId,
          employeeId: employeeId,
          hours: value,
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
  };
  return <FormObserver id={id} handleOnChange={handleOnChange} />;
};
