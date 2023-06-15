import { Box, Button, Stack, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGetProjectsWithRecordQuery } from '@graphql/project/project';
import { formatDate, formatUTCHours, USDollar } from '../../utils/helperFun';
import IconButton from '@mui/material/IconButton';
import LaunchIcon from '@mui/icons-material/Launch';
import { FormDialog } from '@components/form/FormDialog';
import { ChangeEvent, KeyboardEvent, KeyboardEventHandler, useEffect, useState } from 'react';
import { GetAllInvoicesDocument, SearchInvoiceDocument, useCreateOrUpdateInvoiceMutation, useSearchInvoiceLazyQuery } from '@graphql/invoice/invoice';
import { DisplayCard } from '@components/DisplayCard.component';

const columns: GridColDef[] = [
  {
    field: 'employeeName',
    headerName: 'Employee Name',
    width: 200,
    renderCell: (params) => params.row.projectName
  },
  { field: 'workHours', headerName: 'Work Hours', width: 200 },
  { field: 'indirectHours', headerName: 'Indirect Hours', width: 200 },
  { field: 'billableHours', headerName: 'Billable Hours', width: 200 },
  { field: 'amount', headerName: 'Amount', width: 200, renderCell: (params) => USDollar.format(params.row.amount) }
];

export const InvoiceDetails = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState<number>(0);
  const { id, startDate, endDate } = useParams();
  const startDateValue = startDate ? new Date(startDate) : undefined;
  const endDateValue = endDate ? new Date(endDate) : undefined;
  const { data, loading, error } = useGetProjectsWithRecordQuery({
    variables: {
      startDate: formatUTCHours(startDateValue),
      endDate: formatUTCHours(endDateValue)
    },
    fetchPolicy: 'cache-and-network'
  });

  const [createOrUpdateInvoiceMutation, { data: createOrUpdateData, loading: createOrUpdateLoading, error: createOrUpdateError }] = useCreateOrUpdateInvoiceMutation();

  const project = data?.getProjectsWithRecord.find((project) => project.id === id);
  const [SearchInvoiceQuery, { data: searchData, loading: searchLoading, error: searchError }] = useSearchInvoiceLazyQuery();
  const searchVariable = {
    projectId_startDate_endDate: {
      projectId: id as string,
      startDate: formatUTCHours(startDateValue),
      endDate: formatUTCHours(endDateValue)
    }
  };
  useEffect(() => {
    SearchInvoiceQuery({
      variables: searchVariable,
      fetchPolicy: 'cache-and-network'
    }).then((r) => r.data && setInput(r.data.searchInvoice.hours));
  }, [project]);

  const rows = project
    ? project.inner
        .filter((employee) => employee.employeeWorkHours !== 0)
        .map((employee) => {
          const { employeeName, employeeId, employeeWorkHours, employeeIndirectHours } = employee;
          const billableHours = employeeIndirectHours + employeeWorkHours;
          const amount = billableHours * 65;
          return {
            employeeName: employeeName,
            id: employeeId,
            workHours: employeeWorkHours,
            indirectHours: employeeIndirectHours,
            billableHours: billableHours,
            amount: amount
          };
        })
    : [];

  const handleSubmit = () => {
    if (project && input > 0 && startDateValue && endDateValue) {
      const { id } = project;
      const rate = 65; // fake data
      const amount = rate * input;

      const invoice = {
        projectId: id,
        startDate: formatUTCHours(startDateValue),
        endDate: formatUTCHours(endDateValue),
        hours: input,
        rate: rate,
        amount: amount
      };

      createOrUpdateInvoiceMutation({
        variables: {
          invoice: invoice
        },
        refetchQueries: [
          { query: GetAllInvoicesDocument },
          {
            query: SearchInvoiceDocument,
            variables: searchVariable
          }
        ]
      }).then((r) => console.log(r));

      setOpen(false);
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default form submission behavior
      handleSubmit(); // Call your submit function or trigger your desired action
    }
  };

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ marginTop: 8 }}>
          <h3>{`Project Name: ${project?.name}`}</h3>
          <Box sx={{ display: 'flex', alignItem: 'center', gap: 1 }}>
            <CalendarTodayIcon />
            <div>{`${formatDate(startDateValue)} - ${formatDate(endDateValue)}`}</div>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <IconButton>
            <LaunchIcon color="secondary" />
          </IconButton>
          <IconButton>
            <DeleteIcon color="secondary" />
          </IconButton>
        </Box>
      </Box>
      <Stack direction="row" justifyContent="space-between" marginTop={5}>
        <DisplayCard id="Original billable hours" title="Original Billable Hour" data={project?.billableHours} />
        <DisplayCard id="Original billable hours" title="Original Invoice Amount" data={project && USDollar.format(project.billableHours * 65)} />
        <DisplayCard id="Original billable hours" title="Adjustment Hours" data={searchData && project && searchData.searchInvoice.hours - project.billableHours} />
        <DisplayCard id="Original billable hours" title="Revised total billable hours" data={searchData?.searchInvoice?.hours} />
        <DisplayCard id="Original billable hours" title="Revised Invoice Amount" data={searchData && USDollar.format(searchData.searchInvoice.amount)} />
      </Stack>
      <DataGrid
        sx={{ marginTop: 6, color: '#021352', backgroundColor: 'white', border: 'none' }}
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        hideFooterPagination={true}
        hideFooter={true}
        autoHeight={true}
      />
      <Box>
        <Box>
          <Button variant="contained" sx={{ marginTop: 5 }} onClick={() => setOpen(true)}>
            Change Total Billable Hours
          </Button>
          <FormDialog open={open} title="Update Total Billable Hours" onClose={() => setOpen(false)}>
            <TextField
              id="billableHours"
              type="number"
              name="hours"
              label="Billable Hours"
              placeholder="Billable Hours"
              value={input}
              required
              sx={{ width: '100%', marginTop: 2 }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(parseFloat(e.target.value))}
              onKeyDown={(e) => handleKeyPress(e)}
            />
            <Button variant="contained" sx={{ width: '100%', marginTop: 3 }} onClick={handleSubmit}>
              Submit
            </Button>
          </FormDialog>
        </Box>
      </Box>
    </Box>
  );
};
