import { DataGrid, GridColDef } from '@mui/x-data-grid';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { Box, Chip, styled } from '@mui/material';
import { FC, SyntheticEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Paths } from '@constants/paths';

let USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

const CustomIDCellRender = (props: { value: string }) => {
  const { value } = props;
  return (
    <Link to={`${Paths.INVOICE}/${value}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItem: 'center', gap: 2 }}>
        <DescriptionOutlinedIcon sx={{ color: 'rgb(115,126,137)', fontSize: 'large' }} />
        <Box sx={{ margin: 'auto' }}>#{value}</Box>
      </Box>
    </Link>
  );
};

const StyledChip = styled(Chip)(({ theme, value }: { theme?: any; value: string }) => ({
  color: value.toLowerCase() === 'paid' ? theme.palette.success.main : theme.palette.error.main,
  backgroundColor: value.toLowerCase() === 'paid' ? theme.palette.success.light : theme.palette.error.light,
  fontWeight: 'bold',
  borderRadius: '8px',
  shadows: 'md'
}));

interface CustomStatusCellRenderProps {
  value: string;
}
const CustomStatusCellRender: FC<CustomStatusCellRenderProps> = ({ value }) => <StyledChip value={value} label={value} />;

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'INVOICE ID',
    width: 130,
    renderCell: (params) => <CustomIDCellRender value={params.row.id} />
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
    field: 'status',
    headerName: 'Status',
    width: 100,
    renderCell: (params) => <CustomStatusCellRender value={params.row.status} />,
    sortable: false,
    editable: true
  }
];

const rows = [
  {
    id: 1,
    startDate: '5/1/2023',
    endDate: '5/7/2023',
    hours: 35,
    amount: 3500,
    status: 'PAID'
  },
  {
    id: 2,
    startDate: '5/8/2023',
    endDate: '5/14/2023',
    hours: 42,
    amount: 4200,
    status: 'UNPAID'
  },
  {
    id: 3,
    startDate: '5/15/2023',
    endDate: '5/21/2023',
    hours: 45,
    amount: 4500,
    status: 'PAID'
  },
  {
    id: 4,
    startDate: '5/22/2023',
    endDate: '5/28/2023',
    hours: 16,
    amount: 1600,
    status: 'PAID'
  },
  {
    id: 5,
    startDate: '5/29/2023',
    endDate: '6/5/2023',
    hours: 20,
    amount: 2000,
    status: 'UNPAID'
  }
];

export const Invoice = () => {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <Box sx={{ width: '100%' }}>
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
    </div>
  );
};
