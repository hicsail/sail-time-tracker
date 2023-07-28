import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Paths } from '@constants/paths';
import { convertToUTCDate, formatDateToDashFormat, formatDateToForwardSlashFormat, USDollar } from '../../utils/helperFun';
import FolderIcon from '@mui/icons-material/Folder';
import { GetAllInvoicesDocument, useDeleteInvoiceMutation, useGetAllInvoicesQuery } from '@graphql/invoice/invoice';
import React, { useState } from 'react';
import { format } from 'date-fns';
import { FormDialog } from '@components/form/FormDialog';
import { SearchBar } from '@components/SearchBar';
import { SortedBasicTable } from '@components/table/SortedBasicTable';
import { StyledDatePicker } from '@components/StyledDatePicker';
import { useSnackBar } from '@context/snackbar.context';

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

export const Invoice = () => {
  const [searchText, setSearchText] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<{ projectId: string; startDate: string; endDate: string } | null>(null);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const { data } = useGetAllInvoicesQuery();
  const [deleteInvoice] = useDeleteInvoiceMutation();
  const { toggleSnackBar } = useSnackBar();
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

  const handleDeleteInvoice = async (projectId: string, startDate: string, endDate: string) => {
    const res = await deleteInvoice({
      variables: {
        projectId_startDate_endDate: {
          projectId,
          startDate,
          endDate
        }
      },
      refetchQueries: [{ query: GetAllInvoicesDocument }]
    });
    handleCloseFormDialog();
    res?.data?.deleteInvoice && toggleSnackBar(`Successfully deleted the invoice!`, { variant: 'success' });
  };

  const handleCloseFormDialog = () => setOpenDialog(false);
  const handleOpenFormDialog = (projectId: string, startDate: string, endDate: string) => {
    setCurrentInvoice({ projectId, startDate, endDate });
    setOpenDialog(true);
  };

  const columns: any[] = [
    {
      field: 'projectName',
      headerName: 'PROJECT NAME',
      width: 150,
      renderCell: (row: any) => <CustomIDCellRender id={row.projectId} startDate={row.startDate} endDate={row.endDate} value={row.projectName} />
    },
    {
      field: 'startDate',
      headerName: 'START DATE',
      width: 130,
      sortValue: (row: any) => new Date(row.startDate)
    },
    { field: 'endDate', headerName: 'END DATE', width: 130, sortValue: (row: any) => new Date(row.endDate) },
    {
      field: 'hours',
      headerName: 'TOTAL HOURS',
      type: 'number',
      width: 150,
      sortValue: (row: any) => row.hours
    },
    {
      field: 'amount',
      headerName: 'INVOICE AMOUNT',
      type: 'number',
      renderCell: (row: any) => `${USDollar.format(row.amount)}`,
      width: 160,
      sortValue: (row: any) => row.amount
    },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: (row: any) => <DeleteIcon color="secondary" sx={{ cursor: 'pointer' }} onClick={() => handleOpenFormDialog(row.projectId, row.startDate, row.endDate)} />
    }
  ];
  const ToolBar = (
    <>
      <Stack direction="row" gap={2} mb={3}>
        <Box sx={{ display: 'flex', gap: 5 }}>
          <StyledDatePicker
            label="Start Date"
            value={dateRange.startDate}
            onChange={(newValue: Date | null) => {
              setDateRange((prevState: any) => ({
                ...prevState,
                startDate: newValue
              }));
            }}
          />
          <StyledDatePicker
            label="End Date"
            value={dateRange.endDate}
            onChange={(newValue: Date | null) => {
              setDateRange((prevState: any) => ({
                ...prevState,
                endDate: newValue
              }));
            }}
          />
        </Box>
        <SearchBar id="search invoices" value={searchText} setValue={setSearchText} />
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
      <SortedBasicTable
        rows={filteredRows}
        toolbar={ToolBar}
        columns={columns}
        keyFun={keyFun}
        defaultOrderBy="startDate"
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 }
          }
        }}
      />
      <FormDialog open={openDialog} onClose={handleCloseFormDialog}>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Delete Invoice
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Are you sure you want to delete this invoice?
        </Typography>
        <Stack direction="row" gap={2} justifyContent="end">
          <Button
            color="error"
            variant="contained"
            onClick={() => currentInvoice && handleDeleteInvoice(currentInvoice.projectId, currentInvoice.startDate, currentInvoice.endDate)}
          >
            delete
          </Button>
          <Button color="secondary" variant="outlined" onClick={handleCloseFormDialog}>
            cancel
          </Button>
        </Stack>
      </FormDialog>
    </Box>
  );
};
