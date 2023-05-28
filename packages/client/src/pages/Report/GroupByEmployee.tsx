import { CollapsibleTable } from '@pages/Report/components/table/CollapsibleTable';
import { Box } from '@mui/material';
import { useGetEmployeeListWithRecordQuery } from '@graphql/employee/employee';
import { startOfWeek } from 'date-fns';
import { FC } from 'react';
import { formatHours } from '../../utils/formatHours';

interface GroupByEmployeeProps {
  date: Date;
}

export const GroupByEmployee: FC<GroupByEmployeeProps> = ({ date }) => {
  // get all employees with records
  const { data } = useGetEmployeeListWithRecordQuery({
    variables: {
      date: startOfWeek(date, { weekStartsOn: 1 })
    }
  });

  // construct rows
  const rows = data
    ? data.employees.map((employee) => {
        const totalWorkHours = employee.records
          .filter((record) => record.project.name !== 'Indirect' && record.project.name !== 'Absence')
          .reduce((sum, currentValue) => sum + currentValue.hours, 0);

        let totalIndirectHours = employee.records.filter((record) => record.project.name === 'Indirect').reduce((sum, currentValue) => sum + currentValue.hours, 0);

        // projects in record that belongs the employee, excludes indirect and absence
        const inner = employee.records
          .filter((record) => record.project.name !== 'Indirect' && record.project.name !== 'Absence')
          .map((record) => {
            const indirectHour = (record.hours / totalWorkHours) * totalIndirectHours;
            return {
              id: record.project.id,
              name: record.project.name,
              isBillable: record.project.isBillable,
              workHours: formatHours(record.hours),
              indirectHours: formatHours(indirectHour),
              percentage: formatHours((record.hours / totalWorkHours) * 100) + '%'
            };
          });

        return {
          name: employee.name,
          workHours: formatHours(totalWorkHours),
          indirectHours: formatHours(totalIndirectHours),
          billableHours: formatHours(totalWorkHours + totalIndirectHours),
          inner: inner
        };
      })
    : [];

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
      render: (row: any) => row.name
    },
    {
      name: 'IsBillable',
      render: (row: any) => {
        return (
          <Box
            sx={row.isBillable ? { backgroundColor: 'rgb(250, 236,204)' } : { backgroundColor: 'rgb(250, 227,222)' }}
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
      name: 'Percentage',
      render: (row: any) => row.percentage
    }
  ];

  return <CollapsibleTable rows={rows} outerTableConfig={outerTableConfig} innerTableConfig={innerTableConfig} innerTitle="Project" />;
};
