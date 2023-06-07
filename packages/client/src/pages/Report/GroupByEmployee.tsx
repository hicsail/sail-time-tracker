import { CollapsibleTable } from '@pages/Report/components/table/CollapsibleTable';
import { Box } from '@mui/material';
import { useGetEmployeeListWithRecordQuery } from '@graphql/employee/employee';
import { FC } from 'react';
import { formatHours, formatPercentage } from '../../utils/formatHours';

interface GroupByEmployeeProps {
  startDate: Date;
  endDate: Date;
}

export const GroupByEmployee: FC<GroupByEmployeeProps> = ({ startDate, endDate }) => {
  // get all employees with records
  const { data } = useGetEmployeeListWithRecordQuery({
    variables: {
      startDate: startDate.setUTCHours(4, 0, 0, 0),
      endDate: endDate.setUTCHours(4, 0, 0, 0)
    }
  });

  // construct rows
  const rows = data
    ? data.employees
        .filter((employee) => employee.status !== 'Inactive')
        .map((employee) => {
          const totalWorkHours = employee.records
            .filter((record) => record.project.name !== 'Indirect' && record.project.name !== 'Absence')
            .reduce((sum, currentValue) => sum + currentValue.hours, 0);

          let totalIndirectHours = employee.records.filter((record) => record.project.name === 'Indirect').reduce((sum, currentValue) => sum + currentValue.hours, 0);
          let projectHoursMap = new Map();
          let uniqueProjectList: any[] = [];

          // store unique projects and total hours to uniqueProjectList
          // from startDate to endDate
          employee.records
            .filter((record) => record.project.name !== 'Indirect' && record.project.name !== 'Absence')
            .forEach((record) => {
              if (!projectHoursMap.get(record.project.id)) {
                projectHoursMap.set(record.project.id, record.hours);
                uniqueProjectList.push(record);
              } else {
                projectHoursMap.set(record.project.id, projectHoursMap.get(record.project.id) + record.hours);
              }
            });

          // get inner table data
          const inner = uniqueProjectList.map((record) => {
            const indirectHour = (projectHoursMap.get(record.project.id) / totalWorkHours) * totalIndirectHours;
            return {
              id: record.project.id,
              name: record.project.name,
              isBillable: record.project.isBillable,
              workHours: formatHours(projectHoursMap.get(record.project.id)),
              indirectHours: formatHours(indirectHour),
              percentage: formatPercentage(projectHoursMap.get(record.project.id) / totalWorkHours)
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
      name: 'Percentage',
      render: (row: any) => row.percentage + '%'
    }
  ];

  return <CollapsibleTable rows={rows} outerTableConfig={outerTableConfig} innerTableConfig={innerTableConfig} innerTitle="Project" />;
};
