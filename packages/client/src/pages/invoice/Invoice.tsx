import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Paths } from '@constants/paths';
import { convertToUTCDate, formatDateToDashFormat, formatDateToForwardSlashFormat, USDollar } from '../../utils/helperFun';
import FolderIcon from '@mui/icons-material/Folder';
import { GetAllInvoicesDocument, useDeleteInvoiceMutation, useGetAllInvoicesQuery } from '@graphql/invoice/invoice';
import React, { useState } from 'react';
import { FormDialog } from '@components/form/FormDialog';
import { SortedBasicTable } from '@components/table/SortedBasicTable';
import { useSnackBar } from '@context/snackbar.context';
import { Toolbar } from '@pages/invoice/components/table/Toolbar';

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
        const projectName = invoice?.project?.name;
        const { startDate, endDate, hours, amount, project } = invoice;
        const formattedStartDate = formatDateToForwardSlashFormat(convertToUTCDate(new Date(startDate)));
        const formattedEndDate = formatDateToForwardSlashFormat(convertToUTCDate(new Date(endDate)));
        const id = `${invoice?.project?.id}-${formattedStartDate}-${formattedEndDate}`;
        return {
          id: id,
          projectId: project?.id,
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
      return row?.projectName?.toLowerCase().includes(searchText.toLowerCase()) && newStartDate >= dateRange.startDate && newEndDate <= dateRange.endDate;
    }
    return row?.projectName?.toLowerCase().includes(searchText.toLowerCase());
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

  return (
    <Stack gap={8}>
      <Stack>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'customColors.interstellarBlue' }}>
          Billing & Invoices
        </Typography>
        <Typography variant="body2" sx={{ color: 'secondary.light' }}>
          Managing and viewing all your invoices.
        </Typography>
      </Stack>
      <SortedBasicTable
        rows={filteredRows}
        toolbar={
          <Toolbar
            dateRange={dateRange}
            setDateRange={setDateRange}
            searchText={searchText}
            setSearchText={setSearchText}
            filteredRows={filteredRows}
            handleClearButtonClick={handleClearButtonClick}
            handleReset={handleReset}
          />
        }
        columns={columns}
        keyFun={keyFun}
        defaultOrderBy="startDate"
      />
      <FormDialog open={openDialog} onClose={handleCloseFormDialog}>
        <Stack gap={4}>
          <Typography variant="h6">Delete Invoice</Typography>
          <Typography variant="body1">Are you sure you want to delete this invoice?</Typography>
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
        </Stack>
      </FormDialog>
    </Stack>
  );
};
