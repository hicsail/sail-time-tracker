import { Box, Button, Divider, Stack, TextField, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGetProjectWithEmployeeRecordsQuery } from '@graphql/employee/employee';
import { formatDateToForwardSlashFormat, formatDateToDashFormat, USDollar } from '../../utils/helperFun';
import IconButton from '@mui/material/IconButton';
import LaunchIcon from '@mui/icons-material/Launch';
import { FormDialog } from '@components/form/FormDialog';
import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import { GetAllInvoicesDocument, SearchInvoiceDocument, useCreateOrUpdateInvoiceMutation, useSearchInvoiceLazyQuery } from '@graphql/invoice/invoice';
import { DisplayCard } from '@components/DisplayCard.component';
import { CommentInputBox } from '@pages/Invoice/CommentInputBox';
import { useAddCommentMutation, useDeleteCommentMutation } from '@graphql/comment/comment';
import { CommentDisplayComponent } from '@pages/Invoice/CommentDisplayComponent';
import { CommentListItem } from '@pages/Invoice/CommentListItem';
import { CommentList } from '@pages/Invoice/CommentList';

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
  const [totalBillableHours, setTotalBillableHours] = useState<number>(0);
  const { id, startDate, endDate } = useParams();
  const startDateValue = startDate ? new Date(startDate) : undefined;
  const endDateValue = endDate ? new Date(endDate) : undefined;
  const { data, loading, error } = useGetProjectWithEmployeeRecordsQuery({
    variables: {
      startDate: formatDateToDashFormat(startDateValue),
      endDate: formatDateToDashFormat(endDateValue)
    },
    fetchPolicy: 'cache-and-network'
  });

  const project = data?.getProjectWithEmployeeRecords.find((project) => project.id === id);
  const [createOrUpdateInvoiceMutation, { data: createOrUpdateData, loading: createOrUpdateLoading, error: createOrUpdateError }] = useCreateOrUpdateInvoiceMutation();
  const [SearchInvoiceQuery, { data: searchInvoiceData, loading: searchInvoiceLoading, error: searchInvoiceError }] = useSearchInvoiceLazyQuery();
  const [addCommentMutation, { data: addCommentData, loading: addCommentLoading, error: addCommentError }] = useAddCommentMutation();
  const [deleteCommentMutation] = useDeleteCommentMutation();
  const searchInvoiceVariable = {
    projectId_startDate_endDate: {
      projectId: id as string,
      startDate: formatDateToDashFormat(startDateValue),
      endDate: formatDateToDashFormat(endDateValue)
    }
  };

  useEffect(() => {
    SearchInvoiceQuery({
      variables: searchInvoiceVariable,
      fetchPolicy: 'cache-and-network'
    }).then((r) => r.data && setTotalBillableHours(r.data.searchInvoice.hours));
  }, [project]);

  const rows =
    project?.inner
      ?.filter((employee) => employee.employeeWorkHours !== 0)
      ?.map((employee) => {
        const { employeeName, employeeId, employeeWorkHours, employeeIndirectHours } = employee;
        const billableHours = employeeIndirectHours + employeeWorkHours;
        const amount = billableHours * 65;
        return {
          employeeName,
          id: employeeId,
          workHours: employeeWorkHours,
          indirectHours: employeeIndirectHours,
          billableHours,
          amount
        };
      }) ?? [];

  const handleSubmit = () => {
    if (project && totalBillableHours > 0 && startDateValue && endDateValue) {
      const { id } = project;
      const rate = 65; // fake data
      const amount = rate * totalBillableHours;

      const invoice = {
        projectId: id,
        startDate: formatDateToDashFormat(startDateValue),
        endDate: formatDateToDashFormat(endDateValue),
        hours: totalBillableHours,
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
            variables: searchInvoiceVariable
          }
        ]
      });

      setOpen(false);
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default form submission behavior
      handleSubmit(); // Call your submit function or trigger your desired action
    }
  };

  const handleOnSubmitComment = (value: string | undefined) => {
    if (value && searchInvoiceData) {
      addCommentMutation({
        variables: {
          input: {
            content: value,
            invoiceId: searchInvoiceData?.searchInvoice.invoiceId
          }
        },
        refetchQueries: [
          {
            query: SearchInvoiceDocument,
            variables: searchInvoiceVariable
          }
        ]
      });
    }
  };

  const handleOnDelete = (id: string) => {
    deleteCommentMutation({
      variables: {
        id: id
      },
      refetchQueries: [
        {
          query: SearchInvoiceDocument,
          variables: searchInvoiceVariable
        }
      ]
    });
  };

  return (
    <Box sx={{ height: 'auto', margin: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ marginTop: 8 }}>
          <h3>{`Project Name: ${project?.name}`}</h3>
          <Box sx={{ display: 'flex', alignItem: 'center', gap: 1 }}>
            <CalendarTodayIcon />
            <div>{`${formatDateToForwardSlashFormat(startDateValue)} - ${formatDateToForwardSlashFormat(endDateValue)}`}</div>
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
        <DisplayCard id="Original billable hours" title="Adjustment Hours" data={searchInvoiceData && project && searchInvoiceData.searchInvoice.hours - project.billableHours} />
        <DisplayCard id="Original billable hours" title="Revised total billable hours" data={searchInvoiceData?.searchInvoice?.hours} />
        <DisplayCard id="Original billable hours" title="Revised Invoice Amount" data={searchInvoiceData && USDollar.format(searchInvoiceData.searchInvoice.amount)} />
      </Stack>
      <Box>
        <DataGrid
          sx={{ marginTop: 6, color: '#021352', backgroundColor: 'white', border: 'none' }}
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          hideFooterPagination={true}
          hideFooter={true}
          autoHeight={true}
        />
      </Box>
      <Box>
        <Button variant="contained" sx={{ marginTop: 5 }} onClick={() => setOpen(true)}>
          Change Total Billable Hours
        </Button>
        <FormDialog open={open} onClose={() => setOpen(false)}>
          <Typography variant="h6">Update Total Billable Hours</Typography>
          <TextField
            id="billableHours"
            type="number"
            name="hours"
            label="Billable Hours"
            placeholder="Billable Hours"
            value={totalBillableHours}
            required
            sx={{ width: '100%', marginTop: 2 }}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTotalBillableHours(parseFloat(e.target.value))}
            onKeyDown={(e) => handleKeyPress(e)}
          />
          <Button variant="contained" sx={{ width: '100%', marginTop: 3 }} onClick={handleSubmit}>
            Submit
          </Button>
        </FormDialog>
      </Box>
      <Box sx={{ marginTop: 5 }}>
        <CommentInputBox onSubmit={handleOnSubmitComment} />
        <Divider sx={{ color: 'grey.400', fontSize: '0.8rem', marginTop: 5 }}>comments</Divider>
        <CommentDisplayComponent>
          <CommentList>
            {searchInvoiceData &&
              searchInvoiceData.searchInvoice.comments.map((item: any) => {
                return <CommentListItem date={new Date(item.createDate)} content={item.content} onDelete={() => handleOnDelete(item.commentId)} key={item.commentId} />;
              })}
          </CommentList>
        </CommentDisplayComponent>
      </Box>
    </Box>
  );
};
