import DeleteIcon from '@mui/icons-material/Delete';
import { Box, InputAdornment, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Paths } from '@constants/paths';
import { convertToUTCDate, formatDateToDashFormat, formatDateToForwardSlashFormat, USDollar } from '../../utils/helperFun';
import FolderIcon from '@mui/icons-material/Folder';
import { useGetAllInvoicesQuery } from '@graphql/invoice/invoice';
import { BasicTable } from './components/table/BasicTable';
import { TextInput } from '@components/TextInput';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from '@mui/x-date-pickers';
import { useDateRange } from '@context/reportFilter.context';
import { CustomDatePickerLayout } from '@pages/Track/components/DatePicker/CustomDatePickerLayout';
import { useState } from 'react';

const CustomIDCellRender = (props: { id: string; value: string; startDate: Date; endDate: Date }) => {
  const { id, value, startDate, endDate } = props;
  const start_date = formatDateToDashFormat(new Date(startDate));
  const end_date = formatDateToDashFormat(new Date(endDate));

  return (
    <Link to={`${Paths.INVOICE}/${id}/${start_date}/${end_date}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Box sx={{ display: 'flex', justifyContent: 'start', alignItem: 'center', gap: 2 }}>
        <FolderIcon sx={{ color: 'grey.600', fontSize: 'large' }} />
        <Box>{value}</Box>
      </Box>
    </Link>
  );
};

const columns: any[] = [
  {
    field: 'projectName',
    headerName: 'PROJECT NAME',
    width: 150,
    renderCell: (row: any) => <CustomIDCellRender id={row.projectId} startDate={row.startDate} endDate={row.endDate} value={row.projectName} />
  },
  { field: 'startDate', headerName: 'START DATE', width: 130 },
  { field: 'endDate', headerName: 'END DATE', width: 130 },
  {
    field: 'hours',
    headerName: 'TOTAL HOURS',
    type: 'number',
    width: 150
  },
  {
    field: 'amount',
    headerName: 'INVOICE AMOUNT',
    type: 'number',
    renderCell: (row: any) => `${USDollar.format(row.amount)}`,
    width: 160
  },
  {
    field: 'actions',
    headerName: 'Actions',
    renderCell: () => <DeleteIcon color="secondary" sx={{ cursor: 'pointer' }} />
  }
];

export const Invoice = () => {
  const [searchText, setSearchText] = useState('');
  const { dateRange, setDateRange } = useDateRange();
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

  const filteredRows = rows.filter((row) => {
    return row.projectName.toLowerCase().includes(searchText.toLowerCase());
  });

  const keyFun = (row: any) => row.id;

  const ToolBar = (
    <Stack direction="row" gap={2} mb={3}>
      <Box sx={{ display: 'flex', gap: 5 }}>
        <DatePicker
          label="Start Date"
          value={dateRange.startDate}
          slots={{ layout: CustomDatePickerLayout }}
          onChange={(newValue) => {
            setDateRange((prevState: any) => ({
              ...prevState,
              startDate: newValue
            }));
          }}
        />
        <DatePicker
          label="End Date"
          value={dateRange.endDate}
          slots={{ layout: CustomDatePickerLayout }}
          onChange={(newValue) => {
            setDateRange((prevState: any) => ({
              ...prevState,
              endDate: newValue
            }));
          }}
        />
      </Box>
      <TextInput
        value={searchText}
        setValue={setSearchText}
        id="search-employee"
        variant="outlined"
        placeholder="Search..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ mr: 1, color: 'grey.500' }} />
            </InputAdornment>
          )
        }}
      />
    </Stack>
  );

  return (
    <Box sx={{ width: '100%', marginTop: 8 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 8 }}>
        <Typography variant="h5" sx={{ marginTop: 8, fontWeight: 'bold', color: 'customColors.interstellarBlue' }}>
          Billing & Invoices
        </Typography>
        <Typography variant="body2" sx={{ color: 'secondary.light' }}>
          Managing and viewing all your invoices.
        </Typography>
      </Box>
      <BasicTable
        rows={filteredRows}
        toolbar={ToolBar}
        columns={columns}
        keyFun={keyFun}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 }
          }
        }}
        sx={{ color: 'customColors.interstellarBlue', border: 'none', backgroundColor: 'white' }}
      />
    </Box>
  );
};
