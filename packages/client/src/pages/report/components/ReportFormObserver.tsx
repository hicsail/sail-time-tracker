import { FC } from 'react';
import { FormObserver } from '@components/form/FormObserver';
import { endOfMonth, getMonth, getYear, startOfMonth } from 'date-fns';
import { useCreateOrUpdateBillableHoursMutation } from '@graphql/billable-hours/billable-hours';
import { GetEmployeesWithRecordDocument, GetProjectWithEmployeeRecordsDocument } from '@graphql/employee/employee';
import { formatDateToDashFormat } from '../../../utils/helperFun';

interface ReportFormObserverProps {
  employeeId: string;
  projectId: string;
  startDate: Date;
  endDate: Date;
  id: string;
  precalculatedHours: number;
}

export const ReportFormObserver: FC<ReportFormObserverProps> = (props) => {
  const { employeeId, projectId, startDate, endDate, id, precalculatedHours } = props;
  const [createOrUpdateBillableHours] = useCreateOrUpdateBillableHoursMutation();

  const handleOnChange = (value: number) => {
    // if the start date and end date are not in the same month or in same year, do nothing
    if (getYear(startDate) !== getYear(endDate) || getMonth(startDate) !== getMonth(endDate)) {
      return;
    }

    createOrUpdateBillableHours({
      variables: {
        input: {
          startDate: startOfMonth(startDate),
          endDate: endOfMonth(startDate),
          employeeId: employeeId,
          projectId: projectId,
          precalculatedHours: precalculatedHours,
          billableHours: value
        }
      },
      refetchQueries: [
        {
          query: GetEmployeesWithRecordDocument,
          variables: {
            startDate: formatDateToDashFormat(startDate),
            endDate: formatDateToDashFormat(endDate)
          }
        },
        {
          query: GetProjectWithEmployeeRecordsDocument,
          variables: {
            startDate: formatDateToDashFormat(startDate),
            endDate: formatDateToDashFormat(endDate)
          }
        }
      ]
    });
  };
  return <FormObserver id={id} handleOnChange={handleOnChange} />;
};
