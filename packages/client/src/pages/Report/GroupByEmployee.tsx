import { CollapsibleTable } from '@pages/Report/components/table/CollapsibleTable';
import { Box } from '@mui/material';
import { FC } from 'react';

import { useGetEmployeesWithRecordQuery } from '@graphql/employee/employee';
import { formatDateToDashFormat } from '../../utils/helperFun';

interface GroupByEmployeeProps {
  startDate: Date;
  endDate: Date;
  searchText?: string;
}

export const GroupByEmployee: FC<GroupByEmployeeProps> = ({ startDate, endDate, searchText }) => {
  const { data } = useGetEmployeesWithRecordQuery({
    variables: {
      startDate: formatDateToDashFormat(startDate),
      endDate: formatDateToDashFormat(endDate)
    },
    fetchPolicy: 'cache-and-network'
  });
  const rows = data ? data.getEmployeesWithRecord : [];

  const filteredRows = rows.filter((row) => {
    return row.name.toLowerCase().includes(searchText?.toLowerCase() as string);
  });

  // outer table column name and render config
  const tableConfig = {
    outer: [
      {
        id: 'name',
        name: 'Employees',
        render: (row: any) => row.name
      },
      {
        id: 'workHours',
        name: 'Work Hours',
        render: (row: any) => row.workHours
      },
      {
        id: 'indirectHours',
        name: 'Indirect Hours',
        render: (row: any) => row.indirectHours
      },
      {
        id: 'billableHours',
        name: 'Billable Hours (Work + Indirect)',
        render: (row: any) => row.billableHours
      }
    ],
    inner: [
      {
        id: 'projectName',
        name: 'Name',
        render: (row: any) => row.projectName
      },
      {
        id: 'projectIsBillable',
        name: 'IsBillable',
        render: (row: any) => {
          return (
            <Box
              sx={row.isBillable ? { backgroundColor: 'success.light', color: 'success.main' } : { backgroundColor: 'error.light', color: 'error.main' }}
              width={40}
              height={20}
              textAlign="center"
              borderRadius="3px"
            >
              {row.isBillable.toString()}
            </Box>
          );
        }
      },
      {
        id: 'projectWorkHours',
        name: 'Work Hours',
        render: (row: any) => row.projectWorkHours
      },
      {
        id: 'projectIndirectHours',
        name: 'Indirect Hours',
        render: (row: any) => row.projectIndirectHours
      },
      {
        id: 'projectPercentage',
        name: 'Percentage',
        render: (row: any) => row.projectPercentage + '%'
      }
    ]
  };

  return (
    <>
      <CollapsibleTable rows={filteredRows} tableConfig={tableConfig} innerTitle="Project" startDate={startDate} endDate={endDate} />
      {rows.length === 0 && <Box sx={{ textAlign: 'start', marginTop: 5 }}>No data</Box>}
    </>
  );
};
