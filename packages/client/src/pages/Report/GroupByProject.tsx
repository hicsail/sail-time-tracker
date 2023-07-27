import { Box, Tooltip } from '@mui/material';
import { FC } from 'react';
import { GetAllInvoicesDocument, useCreateOrUpdateInvoiceMutation, useSearchInvoicesByDateRangeQuery } from '@graphql/invoice/invoice';
import { formatDateToDashFormat } from '../../utils/helperFun';
import { useGetProjectWithEmployeeRecordsQuery } from '@graphql/employee/employee';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate } from 'react-router-dom';
import { Paths } from '@constants/paths';
import * as React from 'react';
import { InvoiceIcon } from '@components/icons/InvoiceIcon';
import IconButton from '@mui/material/IconButton';
import { differenceInBusinessDays } from 'date-fns';
import { CircularWithValueLabel } from '@pages/Report/components/CircularWithValueLabel';
import { SortedCollapsibleTable } from '@pages/Report/components/table/SortedCollapsibleTable';
import { useSnackBar } from '@context/snackbar.context';

interface GroupByEmployeeProps {
  startDate: Date;
  endDate: Date;
  searchText?: string;
}

export const GroupByProject: FC<GroupByEmployeeProps> = ({ startDate, endDate, searchText }) => {
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
  const { toggleSnackBar } = useSnackBar();

  const rows = data
    ? [
        ...data.getProjectWithEmployeeRecords.filter((project) => project.billableHours !== 0),
        ...data.getProjectWithEmployeeRecords.filter((project) => project.billableHours === 0)
      ].filter((project: any) => project.status === 'Active')
    : [];
  const [createOrUpdateInvoiceMutation] = useCreateOrUpdateInvoiceMutation();
  const filteredRows = rows.filter((row) => row.name.toLowerCase().includes(searchText?.toLowerCase() as string) && row.name !== 'Indirect' && row.name !== 'Absence');

  /**
   * generate invoice
   * @param row
   */
  const handleGenerateInvoice = (row: any) => {
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
      const response = r?.data?.createOrUpdateInvoice;
      if (response) {
        refetchSearchInvoicesByDateRangeQuery();
        response && toggleSnackBar('Successfully generate invoice!', { variant: 'success' });
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
    handleGenerateInvoice(row);
  };

  const getCircularColor = (data: number) => {
    if (data >= 100) {
      return 'error';
    } else if (data >= 90) {
      return 'warning';
    } else {
      return 'primary';
    }
  };

  const tableConfig = {
    outer: [
      {
        field: 'projectName',
        name: 'Projects',
        render: (row: any) => row.name
      },
      {
        field: 'isBillable',
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
        field: 'workHours',
        name: 'Work Hours',
        render: (row: any) => row.workHours,
        sortValue: (row: any) => row.workHours
      },
      {
        field: 'indirectHours',
        name: 'Indirect Hours',
        render: (row: any) => row.indirectHours,
        sortValue: (row: any) => row.indirectHours
      },
      {
        field: 'billableHours',
        name: 'Billable Hours',
        render: (row: any) => row.billableHours,
        sortValue: (row: any) => row.billableHours
      },
      {
        field: 'percentage',
        name: 'Effort',
        render: (row: any) => row.percentage + '%',
        sortValue: (row: any) => row.percentage
      },
      {
        field: 'usage',
        name: 'FTE Usage',
        render: (row: any) => {
          const differences = differenceInBusinessDays(endDate, startDate);
          const maximumWorkHours = row.fte * (differences * 8);
          const percentage = (row.billableHours / maximumWorkHours) * 100;

          return (
            <Tooltip title={`${percentage.toFixed(0)}%`}>
              <IconButton>
                <CircularWithValueLabel progress={percentage} color={getCircularColor(percentage)} />
              </IconButton>
            </Tooltip>
          );
        },
        sortValue: (row: any) => {
          const differences = differenceInBusinessDays(endDate, startDate);
          const maximumWorkHours = row.fte * (differences * 8);
          return (row.billableHours / maximumWorkHours) * 100;
        }
      },
      {
        field: 'actions',
        name: 'Actions',
        render: (row: any) => {
          const isFind = searchInvoicesByDateRangeDate?.searchInvoicesByDateRange?.find((invoice) => invoice.projectId === row.id);
          return (
            <Tooltip title={isFind ? 'View Invoice' : 'Generate Invoice'}>
              <IconButton onClick={() => handleActionsOnClick(row, isFind)} color="secondary" sx={{ width: '50px', height: '50px' }}>
                <Box sx={{ position: 'relative' }}>
                  <InvoiceIcon />
                  {isFind ? (
                    <VisibilityIcon sx={{ position: 'absolute', bottom: '5px', right: '-5px', fontSize: '15px', backgroundColor: 'white', borderRadius: '50%' }} />
                  ) : (
                    <AddCircleOutlineIcon sx={{ position: 'absolute', bottom: '5px', right: '-5px', fontSize: '15px', backgroundColor: 'white', borderRadius: '50%' }} />
                  )}
                </Box>
              </IconButton>
            </Tooltip>
          );
        }
      }
    ],
    inner: [
      {
        field: 'employeeName',
        name: 'Name',
        render: (row: any) => row.employeeName
      },
      {
        field: 'employeeWorkHours',
        name: 'Work Hours',
        render: (row: any) => row.employeeWorkHours
      },
      {
        field: 'employeeIndirectHours',
        name: 'Indirect Hours',
        render: (row: any) => row.employeeIndirectHours
      },
      {
        field: 'employeeBillableHours',
        name: 'Percentage',
        render: (row: any) => row.employeePercentage + '%'
      }
    ]
  };

  return (
    <>
      <SortedCollapsibleTable rows={filteredRows} tableConfig={tableConfig} innerTitle="Employee" startDate={startDate} endDate={endDate} />
      {rows.length === 0 && <Box sx={{ textAlign: 'start', marginTop: 5 }}>No data</Box>}
    </>
  );
};
