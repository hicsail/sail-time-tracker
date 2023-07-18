import { CollapsibleTable } from '@pages/Report/components/table/CollapsibleTable';
import { Box } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { GetAllInvoicesDocument, useCreateOrUpdateInvoiceMutation, useSearchInvoicesByDateRangeQuery } from '@graphql/invoice/invoice';
import { Banner } from '@components/Banner';
import { formatDateToDashFormat } from '../../utils/helperFun';
import { useGetProjectWithEmployeeRecordsQuery } from '@graphql/employee/employee';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate } from 'react-router-dom';
import { Paths } from '@constants/paths';
import * as React from 'react';
import { InvoiceIcon } from '@components/icons/InvoiceIcon';
import IconButton from '@mui/material/IconButton';
import { useTimeout } from '../../utils/useTimeOutHook';

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
  const [createOrUpdateInvoiceMutation, { data: createOrUpdateDate, loading, error }] = useCreateOrUpdateInvoiceMutation();
  const filteredRows = rows.filter((row) => row.name.toLowerCase().includes(searchText?.toLowerCase() as string) && row.name !== 'Indirect' && row.name !== 'Absence');
  useTimeout(() => setDisplayContent(false), 1000, displayContent);

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
    }).then((r) => {
      if (r.data) {
        refetchSearchInvoicesByDateRangeQuery();
        setDisplayContent(true);
      }
    });
  };

  const handleActionsOnClick = (row: any, isFind: { projectId: string } | undefined) => {
    if (isFind) {
      const start_date = formatDateToDashFormat(startDate);
      const end_date = formatDateToDashFormat(endDate);

      navigate(`${Paths.INVOICE}/${row.id}/${start_date}/${end_date}`);
      return;
    }
    handleClick(row);
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
          console.log(row.name);
          console.log(isFind);
          return (
            <IconButton
              onClick={() => handleActionsOnClick(row, isFind)}
              color="secondary"
              sx={{ width: '50px', height: '50px' }}
              title={isFind ? 'View Invoice' : 'Generate Invoice'}
            >
              <Box sx={{ position: 'relative' }}>
                <InvoiceIcon />
                {isFind ? (
                  <VisibilityIcon sx={{ position: 'absolute', bottom: '5px', right: '-5px', fontSize: '15px', backgroundColor: 'white', borderRadius: '50%' }} />
                ) : (
                  <AddCircleOutlineIcon sx={{ position: 'absolute', bottom: '5px', right: '-5px', fontSize: '15px', backgroundColor: 'white', borderRadius: '50%' }} />
                )}
              </Box>
            </IconButton>
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
      {rows.length === 0 && <Box sx={{ textAlign: 'start', marginTop: 5 }}>No data</Box>}
    </>
  );
};
