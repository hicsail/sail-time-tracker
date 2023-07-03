import { CollapsibleTable } from '@pages/Report/components/table/CollapsibleTable';
import { Box, Button } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { GetAllInvoicesDocument, useCreateOrUpdateInvoiceMutation, useSearchInvoicesByDateRangeQuery } from '@graphql/invoice/invoice';
import { Banner } from '@components/Banner';
import { formatDateToDashFormat } from '../../utils/helperFun';
import { useGetProjectWithEmployeeRecordsQuery } from '@graphql/employee/employee';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useNavigate } from 'react-router-dom';
import { Paths } from '@constants/paths';
import * as React from 'react';

interface GroupByEmployeeProps {
  startDate: Date;
  endDate: Date;
  searchText?: string;
}

export const GroupByProject: FC<GroupByEmployeeProps> = ({ startDate, endDate, searchText }) => {
  const [displayContent, setDisplayContent] = useState(false);
  const navigate = useNavigate();
  const { data } = useGetProjectWithEmployeeRecordsQuery({
    variables: {
      startDate: formatDateToDashFormat(startDate),
      endDate: formatDateToDashFormat(endDate)
    },
    fetchPolicy: 'cache-and-network'
  });
  const { data: searchInvoicesByDateRangeDate, refetch: refetchSearchInvoicesByDateRangeQuery } = useSearchInvoicesByDateRangeQuery({
    variables: {
      startDate: formatDateToDashFormat(startDate),
      endDate: formatDateToDashFormat(endDate)
    }
  });

  const rows = data
    ? [
        ...data.getProjectWithEmployeeRecords.filter((project) => project.billableHours !== 0),
        ...data.getProjectWithEmployeeRecords.filter((project) => project.billableHours === 0)
      ].filter((project: any) => project.status === 'Active')
    : [];
  const [filteredRows, setFilteredRows] = useState<any[]>(rows);
  const [createOrUpdateInvoiceMutation, { data: createOrUpdateDate, loading, error }] = useCreateOrUpdateInvoiceMutation();

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

  useEffect(() => {
    setFilteredRows(rows.filter((row) => row.name.toLowerCase().includes(searchText?.toLowerCase() as string)));
  }, [searchText, data]);

  const handleActionsOnClick = (row: any, isFind: { projectId: string } | undefined) => {
    if (isFind) {
      const start_date = formatDateToDashFormat(startDate);
      const end_date = formatDateToDashFormat(endDate);

      navigate(`${Paths.INVOICE}/${row.id}/${start_date}/${end_date}`);
      return;
    }
    handleClick(row);
    refetchSearchInvoicesByDateRangeQuery();
  };

  const tableConfig = {
    outer: [
      {
        id: 'projectName',
        name: 'Projects',
        render: (row: any) => row.name
      },
      {
        id: 'isBillable',
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
              {row.isBillable ? 'true' : 'false'}
            </Box>
          );
        }
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
        name: 'Billable Hours',
        render: (row: any) => row.billableHours
      },
      {
        id: 'percentage',
        name: 'Percentage',
        render: (row: any) => row.percentage + '%'
      },
      {
        id: 'actions',
        name: 'Actions',
        render: (row: any) => {
          const isFind = searchInvoicesByDateRangeDate?.searchInvoicesByDateRange?.find((invoice) => invoice.projectId === row.id);
          return (
            <Button
              variant="outlined"
              onClick={() => handleActionsOnClick(row, isFind)}
              startIcon={isFind ? <VisibilityIcon /> : <AddBoxIcon />}
              color="secondary"
              sx={{ width: '12rem', display: 'flex', justifyContent: 'start' }}
              disabled={row.billableHours === 0}
            >
              {isFind ? 'View Invoice' : 'Generate Invoice'}
            </Button>
          );
        }
      }
    ],
    inner: [
      {
        id: 'employeeName',
        name: 'Name',
        render: (row: any) => row.employeeName
      },
      {
        id: 'employeeWorkHours',
        name: 'Work Hours',
        render: (row: any) => row.employeeWorkHours
      },
      {
        id: 'employeeIndirectHours',
        name: 'Indirect Hours',
        render: (row: any) => row.employeeIndirectHours
      },
      {
        id: 'employeeBillableHours',
        name: 'Percentage',
        render: (row: any) => row.employeePercentage + '%'
      }
    ]
  };

  return (
    <>
      {displayContent && (
        <Box>
          {!loading && !error && createOrUpdateDate && <Banner content={`Successfully generate the invoice`} state="success" />}
          {error && <Banner content={`${error.message}`} state="error" />}
        </Box>
      )}
      <CollapsibleTable rows={filteredRows} tableConfig={tableConfig} innerTitle="Employee" startDate={startDate} endDate={endDate} />
    </>
  );
};
