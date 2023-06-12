import { DataGrid, GridColDef } from '@mui/x-data-grid';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import LaunchIcon from '@mui/icons-material/Launch';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { Paths } from '@constants/paths';
import { useGetInvoiceSummaryQuery } from '@graphql/invoice/invoice';
import { format } from 'date-fns';

const USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

const CustomIDCellRender = (props: { projectId: string; value: string; startDate: Date; endDate: Date }) => {
  const { projectId, value, startDate, endDate } = props;

  const start_date = new Date(startDate);
  const end_date = new Date(endDate);

  const startDateYear = start_date.getFullYear();
  const startDateMonth = start_date.getMonth() + 1;
  const startDateDate = start_date.getDate();

  const endDateYear = end_date.getFullYear();
  const endDateMonth = end_date.getMonth() + 1;
  const endDateDate = end_date.getDate();

  return (
    <Link
      to={`${Paths.INVOICE}/${projectId}/${startDateYear + '-' + startDateMonth + '-' + startDateDate}/${endDateYear + '-' + endDateMonth + '-' + endDateDate}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItem: 'center', gap: 2 }}>
        <DescriptionOutlinedIcon sx={{ color: 'rgb(115,126,137)', fontSize: 'large' }} />
        <Box sx={{ margin: 'auto' }}>{value}</Box>
      </Box>
    </Link>
  );
};

const columns: GridColDef[] = [
  {
    field: 'projectName',
    headerName: 'PROJECT NAME',
    width: 130,
    renderCell: (params) => (
      <CustomIDCellRender projectId={`${params.row.projectId}`} startDate={params.row.startDate} endDate={params.row.endDate} value={params.row.projectName} />
    )
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
  const { data, loading, error } = useGetInvoiceSummaryQuery();

  const rows = data?.invoiceSummary
    ? data.invoiceSummary.map((summary) => {
        const formattedStartDate = format(new Date(summary.startDate), 'MM/dd/yyyy');
        const formattedEndDate = format(new Date(summary.endDate), 'MM/dd/yyyy');
        const projectId = summary.projectId;
        const key = `${summary.projectId}/${summary.startDate}/${summary.endDate}`;

        return { ...summary, startDate: formattedStartDate, endDate: formattedEndDate, projectId: projectId, id: key };
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
