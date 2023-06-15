import { CollapsibleTable } from '@pages/Report/components/table/CollapsibleTable';
import { Box, Button } from '@mui/material';
import { useGetProjectsWithRecordQuery } from '@graphql/project/project';
import { FC, useEffect, useState } from 'react';
import { GetAllInvoicesDocument, useCreateOrUpdateInvoiceMutation } from '@graphql/invoice/invoice';
import { Banner } from '@components/Banner';
import { formatUTCHours } from '../../utils/helperFun';

interface GroupByEmployeeProps {
  startDate: Date;
  endDate: Date;
}

export const GroupByProject: FC<GroupByEmployeeProps> = ({ startDate, endDate }) => {
  const [displayContent, setDisplayContent] = useState(false);
  const { data } = useGetProjectsWithRecordQuery({
    variables: {
      startDate: formatUTCHours(startDate),
      endDate: formatUTCHours(endDate)
    }
  });
  const [createOrUpdateInvoiceMutation, { data: createOrUpdateDate, loading, error }] = useCreateOrUpdateInvoiceMutation();

  /**
   * generate invoice
   * @param row
   */
  const handleClick = (row: any) => {
    const { id, billableHours } = row;
    const rate = 65; // fake data
    const amount = rate * billableHours;

    const invoice = {
      projectId: id,
      startDate: formatUTCHours(startDate),
      endDate: formatUTCHours(endDate),
      hours: billableHours,
      rate: rate,
      amount: amount
    };

    createOrUpdateInvoiceMutation({
      variables: {
        invoice: invoice
      },
      refetchQueries: [{ query: GetAllInvoicesDocument }]
    }).then(() => setDisplayContent(true));
  };

  useEffect(() => {
    // Set the displayContent state to true after a delay of 1500 milliseconds (1.5 seconds)
    const timeoutId = setTimeout(() => {
      setDisplayContent(false);
    }, 1500);

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
          {!loading && !error && createOrUpdateDate && <Banner content={`Successfully add or update the invoice`} state="success" />}
          {error && <Banner content={`${error.message}`} state="error" />}
        </Box>
      )}
      <CollapsibleTable rows={data ? data.getProjectsWithRecord : []} outerTableConfig={outerTableConfig} innerTableConfig={innerTableConfig} innerTitle="Employee" />
    </>
  );
};
