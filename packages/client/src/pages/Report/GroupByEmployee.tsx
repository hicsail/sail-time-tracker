import { CollapsibleTable } from '@pages/Report/components/table/CollapsibleTable';
import { Box } from '@mui/material';
import { FC } from 'react';

import { useGetEmployeesWithRecordQuery } from '@graphql/employee/employee';

interface GroupByEmployeeProps {
  startDate: Date;
  endDate: Date;
}

export const GroupByEmployee: FC<GroupByEmployeeProps> = ({ startDate, endDate }) => {
  // get all employees with records
  const { data } = useGetEmployeesWithRecordQuery({
    variables: {
      startDate: startDate.setUTCHours(4, 0, 0, 0),
      endDate: endDate.setUTCHours(4, 0, 0, 0)
    }
  });

  const rows = data ? [...data.getEmployeesWithRecord.filter((row) => row.workHours !== 0), ...data.getEmployeesWithRecord.filter((row) => row.workHours === 0)] : [];

  // outer table column name and render config
  const outerTableConfig = [
    {
      name: 'Employees',
      render: (row: any) => row.name
    },
    {
      name: 'Work Hours',
      render: (row: any) => row.workHours
    },
    {
      name: 'Indirect Hours',
      render: (row: any) => row.indirectHours
    },
    {
      name: 'Billable Hours (Work + Indirect)',
      render: (row: any) => row.billableHours
    }
  ];

  // inner table column name and render config
  const innerTableConfig = [
    {
      name: 'Name',
      render: (row: any) => row.projectName
    },
    {
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
      name: 'Work Hours',
      render: (row: any) => row.projectWorkHours
    },
    {
      name: 'Indirect Hours',
      render: (row: any) => row.projectIndirectHours
    },
    {
      name: 'Percentage',
      render: (row: any) => row.projectPercentage + '%'
    }
  ];

  return <CollapsibleTable rows={rows} outerTableConfig={outerTableConfig} innerTableConfig={innerTableConfig} innerTitle="Project" />;
};
