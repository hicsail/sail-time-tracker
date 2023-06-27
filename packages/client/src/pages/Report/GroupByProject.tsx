import { CollapsibleTable } from '@pages/Report/components/table/CollapsibleTable';
import { Box, Button } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { GetAllInvoicesDocument, useCreateOrUpdateInvoiceMutation } from '@graphql/invoice/invoice';
import { Banner } from '@components/Banner';
import { formatDateToDashFormat } from '../../utils/helperFun';
import { useGetProjectWithEmployeeRecordsQuery } from '@graphql/employee/employee';

interface GroupByEmployeeProps {
  startDate: Date;
  endDate: Date;
}

export const GroupByProject: FC<GroupByEmployeeProps> = ({ startDate, endDate }) => {
  const [displayContent, setDisplayContent] = useState(false);
  const { data } = useGetProjectWithEmployeeRecordsQuery({
    variables: {
      startDate: formatDateToDashFormat(startDate),
      endDate: formatDateToDashFormat(endDate)
    }
  });
  const [createOrUpdateInvoiceMutation, { data: createOrUpdateDate, loading, error }] = useCreateOrUpdateInvoiceMutation();

  const rows = data
    ? [
        ...data.getProjectWithEmployeeRecords.filter((project) => project.billableHours !== 0),
        ...data.getProjectWithEmployeeRecords.filter((project) => project.billableHours === 0)
      ].filter((project: any) => project.status === 'Active')
    : [];

  /**
   * generate invoice
   * @param row
   */
  const handleClick = (row: any) => {
    const { id, billableHours, rate } = row;
    const amount = rate * billableHours;
    const invoice = {
      projectId: id,
      startDate: formatDateToDashFormat(startDate),
      endDate: formatDateToDashFormat(endDate),
      hours: billableHours,
      rate: rate,
      amount: amount
    };

    createOrUpdateInvoiceMutation({
      variables: {
        invoice: invoice
      },
      refetchQueries: [{ query: GetAllInvoicesDocument }]
    }).then((r) => r.data && setDisplayContent(true));
  };

  useEffect(() => {
    // Set the displayContent state to true after a delay of 700 milliseconds (0.7 seconds)
    const timeoutId = setTimeout(() => {
      setDisplayContent(false);
    }, 700);

    // Clean up the timeout when the component unmounts or the state changes
    return () => {
      clearTimeout(timeoutId);
    };
  }, [displayContent]);

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
        <Button variant="outlined" onClick={() => handleClick(row)}>
          Generate Invoice
        </Button>
      )
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

  return (
    <>
      {displayContent && (
        <Box>
          {!loading && !error && createOrUpdateDate && <Banner content={`Successfully generate the invoice`} state="success" />}
          {error && <Banner content={`${error.message}`} state="error" />}
        </Box>
      )}
      <CollapsibleTable rows={rows} outerTableConfig={outerTableConfig} innerTableConfig={innerTableConfig} innerTitle="Employee" />
    </>
  );
};
