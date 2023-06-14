import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGetProjectsWithRecordQuery } from '@graphql/project/project';
import {formatDate, formatUTCHours, USDollar} from '../../utils/helperFun';

const columns: GridColDef[] = [
  {
    field: 'employeeName',
    headerName: 'Employee Name',
    width: 200,
    renderCell: (params) => params.row.projectName
  },
  { field: 'workHours', headerName: 'Work Hours', width: 200 },
  { field: 'indirectHours', headerName: 'Indirect Hours', width: 200 },
  { field: 'billableHours', headerName: 'Billable Hours', width: 200 },
  { field: 'amount', headerName: 'Amount', width: 200, renderCell: (params) => USDollar.format(params.row.amount) }
];

export const InvoiceDetails = () => {
  const { id, startDate, endDate } = useParams();
  const startDateValue = startDate ? new Date(startDate) : undefined;
  const endDateValue = endDate ? new Date(endDate) : undefined;

  const { data, loading, error } = useGetProjectsWithRecordQuery({
    variables: {
      startDate: formatUTCHours(startDateValue),
      endDate: formatUTCHours(endDateValue)
    },
    fetchPolicy: 'cache-and-network'
  });

  const project = data?.getProjectsWithRecord.find((project) => project.id === id);

  const rows = project
    ? project.inner
        .filter((employee) => employee.employeeWorkHours !== 0)
        .map((employee) => {
          const { employeeName, employeeId, employeeWorkHours, employeeIndirectHours } = employee;
          const billableHours = employeeIndirectHours + employeeWorkHours;
          const amount = billableHours * 65;
          return {
            employeeName: employeeName,
            id: employeeId,
            workHours: employeeWorkHours,
            indirectHours: employeeIndirectHours,
            billableHours: billableHours,
            amount: amount
          };
        })
    : [];

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <h3>{`Project Name: ${project?.name}`}</h3>
          <Box sx={{ display: 'flex', alignItem: 'center', gap: 1 }}>
            <CalendarTodayIcon />
            <div>{`${formatDate(startDateValue)} - ${formatDate(endDateValue)}`}</div>
          </Box>
        </Box>
        <DeleteIcon color="secondary" sx={{ cursor: 'pointer' }} />
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
