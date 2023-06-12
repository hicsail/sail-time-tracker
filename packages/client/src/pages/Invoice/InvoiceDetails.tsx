import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DeleteIcon from '@mui/icons-material/Delete';
import LaunchIcon from '@mui/icons-material/Launch';
import { format } from 'date-fns';
import { useSearchInvoicesMutation } from '@graphql/invoice/invoice';
import { formatUTCHours } from '../../utils/formatDate';
import { useEffect } from 'react';
import { USDollar } from '../../utils/formatDollar';
import IconButton from "@mui/material/IconButton";
import {useGetProjectByIdQuery} from "@graphql/project/project";

export const InvoiceDetails = () => {
  const { id, startDate, endDate } = useParams();
  const [searchInvoicesMutation, { data, loading, error }] = useSearchInvoicesMutation();
  const { data: project } = useGetProjectByIdQuery({
    variables: {
      id: id as string
    },
  });
  const formatStartDate = startDate && formatUTCHours(new Date(startDate));
  const formatEndDate = endDate && formatUTCHours(new Date(endDate));

  useEffect(() => {
    searchInvoicesMutation({
      variables: {
        searchInvoiceInput: {
          projectId: id as string,
          startDate: formatStartDate,
          endDate: formatEndDate
        }
      }
    });
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'employeeName',
      headerName: 'Employee Name',
      width: 200,
      renderCell: (params) => params.row.projectName
    },
    { field: 'hours', headerName: 'Billable Hours', width: 200 },
    { field: 'amount', headerName: 'Amount', width: 200, renderCell: (params) => USDollar.format(params.row.amount) }
  ];

  const rows = data
    ? data.searchInvoices.map((invoice) => {
        return {
          id: invoice.employeeId,
          employeeName: invoice.employee.name,
          hours: invoice.hours,
          amount: invoice.amount
        };
      })
    : [];

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <h3>{`Project Name: ${project?.project.name}`}</h3>
          <Box sx={{ display: 'flex', alignItem: 'center', gap: 1 }}>
            <CalendarTodayIcon />
            <div>{`${startDate && format(new Date(startDate), 'MM/dd/yyyy')} - ${endDate && format(new Date(endDate), 'MM/dd/yyyy')}`}</div>
          </Box>
        </Box>
        <Box sx={{display: 'flex', gap:3}}>
          <IconButton
          >
            <LaunchIcon color="secondary" />
          </IconButton>
          <IconButton>
            <DeleteIcon color="secondary" />
          </IconButton>
        </Box>
      </Box>
      <DataGrid
        sx={{ marginTop: 6, color: '#021352' }}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 }
          }
        }}
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick
      />
    </Box>
  );
};
