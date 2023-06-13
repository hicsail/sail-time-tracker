import { CollapsibleTable } from '@pages/Report/components/table/CollapsibleTable';
import { Box, Button } from '@mui/material';
import { useGetProjectsWithRecordQuery } from '@graphql/project/project';
import { FC } from 'react';

interface GroupByEmployeeProps {
  startDate: Date;
  endDate: Date;
}

export const GroupByProject: FC<GroupByEmployeeProps> = ({ startDate, endDate }) => {
  // get all employees with records
  const { data } = useGetProjectsWithRecordQuery({
    variables: {
      startDate: startDate.setUTCHours(4, 0, 0, 0),
      endDate: endDate.setUTCHours(4, 0, 0, 0)
    }
  });

  const outerTableConfig = [
    {
      name: 'Projects',
      render: (row: any) => row.name
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
      render: (row: any) => row.workHours
    },
    {
      name: 'Indirect Hours',
      render: (row: any) => row.indirectHours
    },
    {
      name: 'Billable Hours',
      render: (row: any) => row.billableHours
    },
    {
      name: 'Percentage',
      render: (row: any) => row.percentage + '%'
    },
    {
      name: '',
      render: () => <Button variant="outlined">Generate Invoice</Button>
    }
  ];

  const innerTableConfig = [
    {
      name: 'Name',
      render: (row: any) => row.employeeName
    },
    {
      name: 'Work Hours',
      render: (row: any) => row.employeeWorkHours
    },
    {
      name: 'Indirect Hours',
      render: (row: any) => row.employeeIndirectHours
    },
    {
      name: 'Percentage',
      render: (row: any) => row.employeePercentage + '%'
    }
  ];

  return <CollapsibleTable rows={data ? data.getProjectsWithRecord : []} outerTableConfig={outerTableConfig} innerTableConfig={innerTableConfig} innerTitle="Employee" />;
};
