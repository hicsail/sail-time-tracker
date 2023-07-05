import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Chip, InputAdornment, Paper, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Paths } from '@constants/paths';
import { convertToUTCDate, formatDateToDashFormat, formatDateToForwardSlashFormat, USDollar } from '../../utils/helperFun';
import FolderIcon from '@mui/icons-material/Folder';
import { useGetAllInvoicesQuery } from '@graphql/invoice/invoice';
import { BasicTable } from './components/table/BasicTable';
import { TextInput } from '@components/TextInput';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from '@mui/x-date-pickers';
import { CustomDatePickerLayout } from '@pages/Track/components/DatePicker/CustomDatePickerLayout';
import { useState } from 'react';
import { format } from 'date-fns';

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
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
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
    const { startDate, endDate } = row;
    const [startDateMonth, startDateDay, startDateYear] = startDate.split('/');
    const [endDateMonth, endDateDay, endDateYear] = endDate.split('/');
    const newStartDate = new Date(parseInt(startDateYear), parseInt(startDateMonth) - 1, parseInt(startDateDay));
    const newEndDate = new Date(parseInt(endDateYear), parseInt(endDateMonth) - 1, parseInt(endDateDay));
    if (dateRange.startDate && dateRange.endDate) {
      return row.projectName.toLowerCase().includes(searchText.toLowerCase()) && newStartDate >= dateRange.startDate && newEndDate <= dateRange.endDate;
    }
    return row.projectName.toLowerCase().includes(searchText.toLowerCase());
  });

  const keyFun = (row: any) => row.id;
  const handleReset = () => {
    setDateRange({ startDate: null, endDate: null });
  };

  const handleClearButtonClick = () => {
    handleReset();
    setSearchText('');
  };

  const ToolBar = (
    <>
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
      <Stack marginBottom="1.5rem">
        {(searchText !== '' || (dateRange.startDate && dateRange.endDate)) && (
          <Box sx={{ marginBottom: 2 }}>
            <strong>{filteredRows.length}</strong>{' '}
            <Box component="span" sx={{ color: 'grey.600' }}>
              results found
            </Box>
          </Box>
        )}
        <Stack direction="row" alignItems="center">
          {dateRange.startDate && dateRange.endDate && (
            <Paper
              variant="outlined"
              sx={{
                border: '1px dashed',
                borderColor: 'grey.300',
                borderRadius: '8px',
                display: 'flex',
                gap: '8px',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50px',
                width: '250px',
                padding: '0 8px'
              }}
            >
              <Box component="span" sx={{ fontWeight: 'medium' }}>
                Date:
              </Box>
              <Stack direction="row" gap="8px">
                <Chip
                  label={dateRange.startDate && dateRange.endDate && `${format(dateRange.startDate, 'dd MMM yy')} - ${format(dateRange.endDate, 'dd MMM yy')}`}
                  sx={{ borderRadius: '8px', width: '100%', backgroundColor: 'grey.900', color: 'white', '& .MuiSvgIcon-root': { color: 'grey.500' } }}
                  onDelete={handleReset}
                />
              </Stack>
            </Paper>
          )}
          {(searchText !== '' || (dateRange.startDate && dateRange.endDate)) && (
            <Button onClick={handleClearButtonClick} sx={{ color: 'error.main', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <DeleteIcon /> Clear
            </Button>
          )}
        </Stack>
      </Stack>
    </>
  );

  return (
    <Box>
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
