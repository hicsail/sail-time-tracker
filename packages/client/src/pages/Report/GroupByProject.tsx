import { CollapsibleTable } from '@pages/Report/components/table/CollapsibleTable';
import { Box, Button } from '@mui/material';
import { useGetProjectListWithRecordQuery } from '@graphql/project/project';
import { FC, useEffect, useState } from 'react';
import { formatHours, formatPercentage } from '../../utils/formatHours';
import { formatUTCHours } from '../../utils/formatDate';
import { useCreateOrUpdateManyInvoiceMutation } from '@graphql/invoice/invoice';
import { Banner } from '@components/Banner';

interface GroupByEmployeeProps {
  startDate: Date;
  endDate: Date;
}

export const GroupByProject: FC<GroupByEmployeeProps> = ({ startDate, endDate }) => {
  const [displayContent, setDisplayContent] = useState(false);
  // get all employees with records
  const { data } = useGetProjectListWithRecordQuery({
    variables: {
      startDate: formatUTCHours(startDate),
      endDate: formatUTCHours(endDate)
    }
  });

  const [createOrUpdateManyInvoiceMutation, { data: createManyInvoiceData, loading, error }] = useCreateOrUpdateManyInvoiceMutation();

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
          let employeeHoursMap = new Map();
          let uniqueEmployeeList: any[] = [];

          // store unique projects and total hours to uniqueProjectList
          // from startDate to endDate
          project.records.map((record) => {
            if (!employeeHoursMap.get(record.employee.id)) {
              employeeHoursMap.set(record.employee.id, record.hours);
              uniqueEmployeeList.push(record);
            } else {
              employeeHoursMap.set(record.employee.id, employeeHoursMap.get(record.employee.id) + record.hours);
            }
          });

          const inner = uniqueEmployeeList.map((record) => {
            return {
              id: record.employee.id,
              name: record.employee.name,
              rate: record.employee.rate,
              workHours: formatHours(employeeHoursMap.get(record.employee.id)),
              indirectHours: formatHours((employeeHoursMap.get(record.employee.id) / workHours) * indirectHour),
              percentage: formatPercentage(employeeHoursMap.get(record.employee.id) / workHours)
            };
          });

          return {
            projectId: project.id,
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

  const handleOnClick = (row: any) => {
    const { projectId, billableHours } = row;

    const invoices = row.inner.map((employee: any) => {
      return {
        employeeId: employee.id,
        projectId: projectId,
        startDate: formatUTCHours(startDate),
        endDate: formatUTCHours(endDate),
        hours: billableHours,
        rate: employee.rate,
        amount: parseFloat(billableHours) * parseFloat(employee.rate)
      };
    });

    createOrUpdateManyInvoiceMutation({
      variables: {
        invoices: invoices
      }
    }).then(() => setDisplayContent(true));
  };

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
      render: (row: any) => (
        <Button variant="outlined" onClick={() => handleOnClick(row)}>
          Generate Invoice
        </Button>
      )
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

  useEffect(() => {
    // Set the displayContent state to true after a delay of 2000 milliseconds (2 seconds)
    const timeoutId = setTimeout(() => {
      setDisplayContent(false);
    }, 1500);

    // Clean up the timeout when the component unmounts or the state changes
    return () => {
      clearTimeout(timeoutId);
    };
  }, [displayContent]);

  return (
    <>
      {displayContent && (
        <Box>
          {!loading && !error && createManyInvoiceData && (
            <Banner content={`Successfully add and update ${createManyInvoiceData.createOrUpdateManyInvoice.count} invoices`} state="success" />
          )}
          {error && <Banner content={`${error.message}`} state="error" />}
        </Box>
      )}
      <CollapsibleTable rows={rowsData} outerTableConfig={outerTableConfig} innerTableConfig={innerTableConfig} innerTitle="Employee" />;
    </>
  );
};
