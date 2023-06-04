import { DataGrid, GridColDef } from '@mui/x-data-grid';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Paths } from '@constants/paths';

let USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

const CustomIDCellRender = (props: { id: string; value: string }) => {
  const { id, value } = props;
  return (
    <Link to={`${Paths.INVOICE}/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItem: 'center', gap: 2 }}>
        <DescriptionOutlinedIcon sx={{ color: 'rgb(115,126,137)', fontSize: 'large' }} />
        <Box sx={{ margin: 'auto' }}>{value}</Box>
      </Box>
    </Link>
  );
};

interface CustomStatusCellRenderProps {
  value: string;
}

const columns: GridColDef[] = [
  {
    field: 'projectName',
    headerName: 'PROJECT NAME',
    width: 130,
    renderCell: (params) => <CustomIDCellRender id={params.row.id} value={params.row.projectName} />
  },
  { field: 'startDate', headerName: 'START DATE', width: 130 },
  { field: 'endDate', headerName: 'END DATE', width: 130 },
  {
    field: 'hours',
    headerName: 'TOTAL HOURS',
    headerAlign: 'left',
    align: 'left',
    type: 'number',
    width: 150
  },
  {
    field: 'amount',
    headerName: 'INVOICE AMOUNT',
    headerAlign: 'left',
    align: 'left',
    type: 'number',
    renderCell: (params) => `${USDollar.format(params.row.amount)}`,
    width: 160,
    sortable: false
  },
  {
    field: 'delete',
    headerName: '',
    renderCell: () => <DeleteIcon color="secondary" sx={{ cursor: 'pointer' }} />
  }
];

const rows = [
  {
    id: 1,
    projectName: 'MPC-WEB',
    startDate: '5/1/2023',
    endDate: '5/7/2023',
    hours: 35,
    amount: 3500
  },
  {
    id: 2,
    projectName: 'ASL-LEX',
    startDate: '5/8/2023',
    endDate: '5/14/2023',
    hours: 42,
    amount: 4200
  },
  {
    id: 3,
    projectName: 'ASL-LEX',
    startDate: '5/15/2023',
    endDate: '5/21/2023',
    hours: 45,
    amount: 4500
  },
  {
    id: 4,
    projectName: 'SIEVE',
    startDate: '5/22/2023',
    endDate: '5/28/2023',
    hours: 16,
    amount: 1600
  },
  {
    id: 5,
    projectName: 'DAMPLAB',
    startDate: '5/29/2023',
    endDate: '6/5/2023',
    hours: 20,
    amount: 2000
  }
];

export const Invoice = () => {
  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <DataGrid
        sx={{ m: 2, color: '#021352' }}
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
