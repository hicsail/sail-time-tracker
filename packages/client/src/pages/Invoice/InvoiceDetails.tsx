import { Box, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { CollapsibleTable } from '@pages/Report/components/table/CollapsibleTable';
import DeleteIcon from '@mui/icons-material/Delete';

export const InvoiceDetails = () => {
  const { id } = useParams();

  const columns: GridColDef[] = [
    {
      field: 'employeeName',
      headerName: 'Employee Name',
      width: 200,
      renderCell: (params) => params.row.projectName
    },
    { field: 'rate', headerName: 'Rate', width: 200 },
    { field: 'amount', headerName: 'Amount', width: 200 }
  ];

  const rows = [
    {
      id: 1,
      employeeName: 'Employee 1',
      rate: 65,
      amount: 3500
    },
    {
      id: 2,
      employeeName: 'Employee 2',
      rate: 65,
      amount: 4200
    },
    {
      id: 3,
      employeeName: 'Employee 3',
      rate: 65,
      amount: 4500
    },
    {
      id: 4,
      employeeName: 'Employee 4',
      rate: 65,
      amount: 1600
    },
    {
      id: 5,
      employeeName: 'Employee 5',
      rate: 65,
      amount: 2000
    }
  ];

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <h3>{`Invoice: #${id}`}</h3>
          <Box sx={{ display: 'flex', alignItem: 'center', gap: 1 }}>
            <CalendarTodayIcon />
            <div>5/29/2023 - 6/5/2023</div>
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
