import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Paths } from '@constants/paths';
import { convertToUTCDate, formatDateToDashFormat, formatDateToForwardSlashFormat, USDollar } from '../../utils/helperFun';
import FolderIcon from '@mui/icons-material/Folder';
import { GetAllInvoicesDocument, useCreateOrUpdateInvoiceMutation, useDeleteInvoiceMutation, useGetAllInvoicesQuery } from '@graphql/invoice/invoice';
import React, { useEffect, useMemo, useState } from 'react';
import { FormDialog } from '@components/form/FormDialog';
import { SortedBasicTable } from '@components/table/SortedBasicTable';
import { useSnackBar } from '@context/snackbar.context';
import { Toolbar } from '@pages/Invoice/components/table/Toolbar';
import { useGetProjectListQuery } from '@graphql/project/project';
import { useGetProjectWithEmployeeRecordsQuery } from '@graphql/employee/employee';
import { StyledDatePicker } from '@components/StyledDatePicker';

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
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState<{ projectId: string; startDate: Date | null; endDate: Date | null }>({
    projectId: '',
    startDate: null,
    endDate: null
  });
  const [customRate, setCustomRate] = useState<string>('');
  const [customHours, setCustomHours] = useState<string>('');

  const { data } = useGetAllInvoicesQuery();
  const { data: projectsData } = useGetProjectListQuery();
  const [deleteInvoice] = useDeleteInvoiceMutation();
  const [createOrUpdateInvoice, { loading: creating }] = useCreateOrUpdateInvoiceMutation();
  const { toggleSnackBar } = useSnackBar();

  const billableProjects = useMemo(
    () =>
      (projectsData?.projects ?? [])
        .filter((p) => p.isBillable)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [projectsData]
  );

  const rows = data
    ? data.invoices.map((invoice) => {
        const { startDate, endDate, hours, amount, project } = invoice;
        const formattedStartDate = formatDateToForwardSlashFormat(convertToUTCDate(new Date(startDate)));
        const formattedEndDate = formatDateToForwardSlashFormat(convertToUTCDate(new Date(endDate)));
        const id = `${invoice?.project?.id}-${formattedStartDate}-${formattedEndDate}`;
        const rawStartDate = formatDateToDashFormat(convertToUTCDate(new Date(startDate))) as string;
        const rawEndDate = formatDateToDashFormat(convertToUTCDate(new Date(endDate))) as string;
        return {
          id,
          projectId: project?.id,
          projectName: project?.name,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          rawStartDate,
          rawEndDate,
          hours,
          amount
        };
      })
    : [];

  const invoiceProjects = useMemo(() => {
    const seen = new Set<string>();
    const result: { id: string; name: string }[] = [];
    for (const row of rows) {
      if (row.projectId && !seen.has(row.projectId)) {
        seen.add(row.projectId);
        result.push({ id: row.projectId, name: row.projectName ?? '' });
      }
    }
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [rows]);

  const { data: recordsData, loading: recordsLoading } = useGetProjectWithEmployeeRecordsQuery({
    variables: {
      startDate: createForm.startDate ? (formatDateToDashFormat(createForm.startDate) as string) : '',
      endDate: createForm.endDate ? (formatDateToDashFormat(createForm.endDate) as string) : ''
    },
    skip: !createForm.startDate || !createForm.endDate || !createForm.projectId || !createDialogOpen
  });

  const selectedProjectRecord = recordsData?.getProjectWithEmployeeRecords?.find((p) => p.id === createForm.projectId);
  const autoHours = selectedProjectRecord?.billableHours ?? 0;
  const selectedProject = billableProjects.find((p) => p.id === createForm.projectId);
  const autoRate = selectedProject?.rate ?? selectedProjectRecord?.rate ?? 0;

  useEffect(() => {
    if (!recordsLoading && createForm.projectId && createForm.startDate && createForm.endDate) {
      setCustomRate(autoRate > 0 ? String(autoRate) : '');
      setCustomHours(autoHours > 0 ? String(autoHours) : '');
    }
  }, [autoRate, autoHours, recordsLoading]);

  const effectiveRate = parseFloat(customRate) || 0;
  const effectiveHours = parseFloat(customHours) || 0;
  const effectiveAmount = effectiveHours * effectiveRate;

  const filteredRows = rows.filter((row) => {
    if (selectedProjectId && row.projectId !== selectedProjectId) return false;
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
    setSelectedProjectId('');
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

  const handleOpenFormDialog = (projectId: string, rawStartDate: string, rawEndDate: string) => {
    setCurrentInvoice({ projectId, startDate: rawStartDate, endDate: rawEndDate });
    setOpenDialog(true);
  };

  const handleCreateInvoice = async () => {
    if (!createForm.projectId || !createForm.startDate || !createForm.endDate) return;
    try {
      await createOrUpdateInvoice({
        variables: {
          invoice: {
            projectId: createForm.projectId,
            startDate: createForm.startDate.toISOString(),
            endDate: createForm.endDate.toISOString(),
            rate: effectiveRate,
            hours: effectiveHours,
            amount: effectiveAmount
          }
        },
        refetchQueries: [{ query: GetAllInvoicesDocument }]
      });
      setCreateDialogOpen(false);
      setCreateForm({ projectId: '', startDate: null, endDate: null });
      setCustomRate('');
      setCustomHours('');
      toggleSnackBar('Invoice created successfully!', { variant: 'success' });
    } catch {
      toggleSnackBar('Failed to create invoice.', { variant: 'error' });
    }
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
      renderCell: (row: any) => (
        <DeleteIcon color="secondary" sx={{ cursor: 'pointer' }} onClick={() => handleOpenFormDialog(row.projectId, row.rawStartDate, row.rawEndDate)} />
      )
    }
  ];

  return (
    <Stack gap={4}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Stack>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'customColors.interstellarBlue' }}>
            Billing & Invoices
          </Typography>
          <Typography variant="body2" sx={{ color: 'secondary.light' }}>
            Managing and viewing all your invoices.
          </Typography>
        </Stack>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateDialogOpen(true)}>
          New Invoice
        </Button>
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
            selectedProjectId={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
            projects={invoiceProjects}
          />
        }
        columns={columns}
        keyFun={keyFun}
        defaultOrderBy="startDate"
      />

      {/* Delete confirmation dialog */}
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

      {/* Quick create invoice dialog */}
      <Dialog open={createDialogOpen} onClose={() => { setCreateDialogOpen(false); setCustomRate(''); setCustomHours(''); }} maxWidth="xs" fullWidth>
        <DialogTitle>New Invoice</DialogTitle>
        <DialogContent>
          <Stack gap={3} pt={1}>
            <FormControl fullWidth>
              <InputLabel>Project</InputLabel>
              <Select
                value={createForm.projectId}
                label="Project"
                onChange={(e) => setCreateForm((f) => ({ ...f, projectId: e.target.value }))}
              >
                {billableProjects.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <StyledDatePicker
              label="Start Date"
              value={createForm.startDate}
              onChange={(d: Date | null) => setCreateForm((f) => ({ ...f, startDate: d }))}
            />
            <StyledDatePicker
              label="End Date"
              value={createForm.endDate}
              onChange={(d: Date | null) => setCreateForm((f) => ({ ...f, endDate: d }))}
            />
            {createForm.projectId && createForm.startDate && createForm.endDate && (
              <Box>
                {recordsLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  <Stack gap={2}>
                    <TextField
                      label="Hours"
                      type="number"
                      size="small"
                      value={customHours}
                      onChange={(e) => setCustomHours(e.target.value)}
                      InputProps={{ endAdornment: <InputAdornment position="end">hrs</InputAdornment> }}
                      inputProps={{ min: 0, step: 0.5 }}
                    />
                    <TextField
                      label="Rate"
                      type="number"
                      size="small"
                      value={customRate}
                      onChange={(e) => setCustomRate(e.target.value)}
                      InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment>, endAdornment: <InputAdornment position="end">/hr</InputAdornment> }}
                      inputProps={{ min: 0, step: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Amount: <strong>{USDollar.format(effectiveAmount)}</strong>
                    </Typography>
                  </Stack>
                )}
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateInvoice}
            disabled={!createForm.projectId || !createForm.startDate || !createForm.endDate || creating}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
