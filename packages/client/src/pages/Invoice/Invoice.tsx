import { DataGrid, GridColDef } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import LaunchIcon from '@mui/icons-material/Launch';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { Paths } from '@constants/paths';
import { formatDate, formatUTCDate, USDollar } from '../../utils/helperFun';
import FolderIcon from '@mui/icons-material/Folder';
import { useGetAllInvoicesQuery } from '@graphql/invoice/invoice';

const CustomIDCellRender = (props: { id: string; value: string; startDate: Date; endDate: Date }) => {
  const { id, value, startDate, endDate } = props;
  const start_date = formatDate(new Date(startDate)).split('/').join('-');
  const end_date = formatDate(new Date(endDate)).split('/').join('-');

  return (
    <Link to={`${Paths.INVOICE}/${id}/${start_date}/${end_date}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItem: 'center', gap: 2 }}>
        <FolderIcon sx={{ color: 'rgb(115,126,137)', fontSize: 'large' }} />
        <Box sx={{ margin: 'auto' }}>{value}</Box>
      </Box>
    </Link>
  );
};

const columns: GridColDef[] = [
  {
    field: 'projectName',
    headerName: 'PROJECT NAME',
    width: 180,
    renderCell: (params) => <CustomIDCellRender id={params.row.projectId} startDate={params.row.startDate} endDate={params.row.endDate} value={params.row.projectName} />
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
    width: 160
  },
  {
    field: 'delete',
    headerName: 'Delete',
    renderCell: () => <DeleteIcon color="secondary" sx={{ cursor: 'pointer' }} />
  },
  {
    field: 'export',
    width: 160,
    headerName: 'Export to Clickup',
    renderCell: () => <LaunchIcon color="secondary" sx={{ cursor: 'pointer' }} />
  }
];

export const Invoice = () => {
  const { data, loading, error } = useGetAllInvoicesQuery();
  const rows = data
    ? data.invoices.map((invoice) => {
        const projectName = invoice.project.name;
        const { startDate, endDate, hours, amount, project } = invoice;
        const formatedStartDate = formatDate(formatUTCDate(new Date(startDate)));
        const formatedEndDate = formatDate(formatUTCDate(new Date(endDate)));
        const id = `${invoice.project.id}-${formatedStartDate}-${formatedEndDate}`;
        return {
          id: id,
          projectId: project.id,
          projectName: projectName,
          startDate: formatedStartDate,
          endDate: formatedEndDate,
          hours,
          amount
        };
      })
    : [];

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
