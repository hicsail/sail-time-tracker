import { endOfMonth, getMonth, getYear, startOfMonth } from 'date-fns';
import { useCreateOrUpdateBillableHoursMutation } from '@graphql/billable-hours/billable-hours';
import { useEffect } from 'react';

interface CreateOrUpdateBillableHoursProps {
  employeeId: string;
  projectId: string;
  startDate: Date;
  endDate: Date;
  value: number;
  precalculatedHours: number;
}

export const createOrUpdateBillableHours = (input: CreateOrUpdateBillableHoursProps) => {
  const { employeeId, projectId, startDate, endDate, precalculatedHours, value } = input;
  const [createOrUpdateBillableHours] = useCreateOrUpdateBillableHoursMutation();

  useEffect(() => {
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
      }
    });
  }, []);

  return;
};
