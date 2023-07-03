import { DataGrid, GridColDef } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import LaunchIcon from '@mui/icons-material/Launch';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Paths } from '@constants/paths';
import { convertToUTCDate, formatDateToDashFormat, formatDateToForwardSlashFormat, USDollar } from '../../utils/helperFun';
import FolderIcon from '@mui/icons-material/Folder';
import { useGetAllInvoicesQuery } from '@graphql/invoice/invoice';

const CustomIDCellRender = (props: { id: string; value: string; startDate: Date; endDate: Date }) => {
  const { id, value, startDate, endDate } = props;
  const start_date = formatDateToDashFormat(new Date(startDate));
  const end_date = formatDateToDashFormat(new Date(endDate));

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
  const { data } = useGetAllInvoicesQuery();
  const rows = data
    ? data.invoices.map((invoice) => {
        const projectName = invoice.project.name;
        const { startDate, endDate, hours, amount, project } = invoice;
        const formattedStartDate = formatDateToForwardSlashFormat(convertToUTCDate(new Date(startDate)));
        const formattedEndDate = formatDateToForwardSlashFormat(convertToUTCDate(new Date(endDate)));
        const id = `${invoice.project.id}-${formattedStartDate}-${formattedEndDate}`;
        return {
          id: id,
          projectId: project.id,
          projectName: projectName,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          hours,
          amount
        };
      })
    : [];

  return (
    <Box sx={{ height: 400 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 8 }}>
        <Typography variant="h5" sx={{ marginTop: 8, fontWeight: 'bold', color: 'customColors.interstellarBlue' }}>
          Billing & Invoices
        </Typography>
        <Typography variant="body2" sx={{ color: 'secondary.light' }}>
          Managing and viewing all your invoices.
        </Typography>
      </Box>
      <DataGrid
        sx={{ color: 'customColors.interstellarBlue', border: 'none', backgroundColor: 'white' }}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 }
          }
        }}
        pageSizeOptions={[10, 15]}
        disableRowSelectionOnClick
        autoHeight={true}
      />
    </Box>
  );
};
