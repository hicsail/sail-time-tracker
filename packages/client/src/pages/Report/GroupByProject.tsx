import { CollapsibleTable } from '@pages/Report/components/table/CollapsibleTable';
import { Box, Button } from '@mui/material';
import { useGetProjectListWithRecordQuery } from '@graphql/project/project';
import { startOfWeek } from 'date-fns';
import { FC } from 'react';
import { formatHours, formatPercentage } from '../../utils/formatHours';

interface GroupByEmployeeProps {
  date: Date;
}

export const GroupByProject: FC<GroupByEmployeeProps> = ({ date }) => {
  // get all employees with records
  const { data } = useGetProjectListWithRecordQuery({
    variables: {
      date: startOfWeek(date, { weekStartsOn: 1 })
    }
  });

  let indirectHours = 0;
  data?.projects.forEach((project) => {
    if (project.name === 'Indirect') {
      indirectHours = project.records.reduce((sum, currentValue) => sum + currentValue.hours, 0);
    }
  });

  const totalWorkHours = data
    ? data.projects
        .filter((project) => project.name !== 'Indirect' && project.name !== 'Absence')
        .map((project) => {
          return project.records.reduce((sum, currentValue) => currentValue.hours + sum, 0);
        })
        .reduce((sum, currentValue) => sum + currentValue, 0)
    : 0;

  // construct rows
  const rowsData = data
    ? data.projects
        .filter((project) => project.name !== 'Indirect' && project.name !== 'Absence' && project.status !== 'Inactive')
        .map((project) => {
          const workHours = project.records.reduce((sum, currentValue) => sum + currentValue.hours, 0);
          const indirectHour = (workHours / totalWorkHours) * indirectHours;

          const inner = project.records.map((record) => {
            return {
              id: record.employee.id,
              name: record.employee.name,
              workHours: formatHours(record.hours),
              indirectHours: formatHours((record.hours / workHours) * indirectHour),
              percentage: formatPercentage(record.hours / workHours)
            };
          });

          return {
            name: project.name,
            isBillable: project.isBillable,
            workHours: formatHours(workHours),
            indirectHours: formatHours(indirectHour),
            percentage: formatPercentage(workHours / totalWorkHours),
            billableHours: formatHours(workHours + indirectHour),
            inner: inner
          };
        })
    : [];

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
      name: 'Percentage',
      render: (row: any) => row.percentage + '%'
    }
  ];

  return <CollapsibleTable rows={rowsData} outerTableConfig={outerTableConfig} innerTableConfig={innerTableConfig} innerTitle="Employee" />;
};
