import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetProjectWithEmployeeRecordsQuery } from '@graphql/employee/employee';
import { convertToUTCDate, formatDateToDashFormat, USDollar } from '../../utils/helperFun';
import { FormDialog } from '@components/form/FormDialog';
import { useState } from 'react';
import {
  GetAllInvoicesDocument,
  SearchInvoiceDocument,
  useCreateOrUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useFindNextInvoiceLazyQuery,
  useFindPreviousInvoiceLazyQuery,
  useSearchInvoiceQuery
} from '@graphql/invoice/invoice';
import { DisplayCard } from '@components/DisplayCard.component';
import { CommentInputBox } from '@pages/Invoice/components/comment/CommentInputBox';
import { useAddCommentMutation, useDeleteCommentMutation } from '@graphql/comment/comment';
import { CommentDisplayComponent } from '@pages/Invoice/components/comment/CommentDisplayComponent';
import { CommentListItem } from '@pages/Invoice/components/comment/CommentListItem';
import { CommentList } from '@pages/Invoice/components/comment/CommentList';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { ObserverTextInput } from '@components/form/ObserverTextInput';
import { Paths } from '@constants/paths';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { SortedBasicTable } from '@components/table/SortedBasicTable';
import { useSnackBar } from '@context/snackbar.context';
import { InvoiceActionBar } from '@pages/Invoice/invoice-detail/InvoiceActionBar';
import { InvoiceDetailHeader } from '@pages/Invoice/invoice-detail/InvoiceDetailHeader';

const columns: any[] = [
  {
    field: 'employeeName',
    headerName: 'Employee Name',
    width: 200,
    renderCell: (row: any) => row.employeeName
  },
  { field: 'workHours', headerName: 'Work Hours', width: 200, sortValue: (row: any) => row.workHours },
  { field: 'indirectHours', headerName: 'Indirect Hours', width: 200, sortValue: (row: any) => row.indirectHours },
  { field: 'billableHours', headerName: 'Billable Hours', width: 200, sortValue: (row: any) => row.billableHours },
  { field: 'amount', headerName: 'Amount', width: 200, renderCell: (row: any) => USDollar.format(row.amount), sortValue: (row: any) => row.amount }
];

const FormValidation = Yup.object({
  billableHours: Yup.number().required('Required').min(0, 'Must be greater than 0')
});

const isOpenDialogInitialValue = {
  edit: false,
  delete: false,
  update: false
};

export const InvoiceDetails = () => {
  const [isOpenDialog, setIsOpenDialog] = useState(isOpenDialogInitialValue);

  const { id, startDate, endDate } = useParams();
  const navigate = useNavigate();
  const { toggleSnackBar } = useSnackBar();

  const [findNextInvoice] = useFindNextInvoiceLazyQuery();
  const [findPreviousInvoice] = useFindPreviousInvoiceLazyQuery();
  const { data: projectWithEmployeeData } = useGetProjectWithEmployeeRecordsQuery({
    variables: {
      startDate: startDate,
      endDate: endDate
    },
    fetchPolicy: 'cache-and-network'
  });
  const project = projectWithEmployeeData?.getProjectWithEmployeeRecords.find((project) => project.id === id);
  const searchInvoiceVariable = {
    projectId_startDate_endDate: {
      projectId: id as string,
      startDate: startDate,
      endDate: endDate
    }
  };
  const { data: searchInvoiceData } = useSearchInvoiceQuery({
    variables: searchInvoiceVariable,
    fetchPolicy: 'cache-and-network'
  });
  const [addCommentMutation] = useAddCommentMutation();
  const [deleteCommentMutation] = useDeleteCommentMutation();
  const [createOrUpdateInvoiceMutation] = useCreateOrUpdateInvoiceMutation();
  const [deleteInvoice] = useDeleteInvoiceMutation();

  const rows =
    searchInvoiceData?.searchInvoice.items?.map((invoiceItem) => {
      const { workHours, indirectHours, billableHours, amount } = invoiceItem;
      const { id, name } = invoiceItem.employee;
      return {
        id,
        employeeName: name,
        workHours,
        indirectHours,
        billableHours,
        amount
      };
    }) ?? [];

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

  const keyFun = (row: any) => row.id;

  const handleDeleteInvoice = () => {
    deleteInvoice({
      variables: searchInvoiceVariable,
      refetchQueries: [
        {
          query: GetAllInvoicesDocument,
          variables: searchInvoiceVariable
        }
      ]
    }).then((r) => r.data && navigate(Paths.INVOICE));
  };

  const handleCloseDialog = (type: string) => setIsOpenDialog((prevState) => ({ ...prevState, [type]: false }));
  const handleOpenDialog = (type: string) => setIsOpenDialog((prevState) => ({ ...prevState, [type]: true }));

  const handlePreviousInvoiceOnClick = () => {
    findPreviousInvoice({
      variables: {
        projectId: id as string,
        startDate: startDate
      },
      fetchPolicy: 'cache-and-network'
    }).then((r) => {
      console.log(r?.data);
      if (r?.data?.findPreviousInvoice) {
        const newInvoiceStartDate = r?.data?.findPreviousInvoice?.startDate;
        const newInvoiceEndDate = r?.data?.findPreviousInvoice?.endDate;
        const formattedStartDate = formatDateToDashFormat(convertToUTCDate(new Date(newInvoiceStartDate)));
        const formattedEndDate = formatDateToDashFormat(convertToUTCDate(new Date(newInvoiceEndDate)));
        navigate(`${Paths.INVOICE}/${id}/${formattedStartDate}/${formattedEndDate}`);
      } else {
        toggleSnackBar('No more invoice', { variant: 'warning' });
      }
    });
  };

  const handleNextInvoiceOnClick = () => {
    findNextInvoice({
      variables: {
        projectId: id as string,
        endDate: endDate
      },
      fetchPolicy: 'cache-and-network'
    }).then((r) => {
      if (r?.data?.findNextInvoice) {
        const newInvoiceStartDate = r?.data?.findNextInvoice?.startDate;
        const newInvoiceEndDate = r?.data?.findNextInvoice?.endDate;
        const formattedStartDate = formatDateToDashFormat(convertToUTCDate(new Date(newInvoiceStartDate)));
        const formattedEndDate = formatDateToDashFormat(convertToUTCDate(new Date(newInvoiceEndDate)));
        navigate(`${Paths.INVOICE}/${id}/${formattedStartDate}/${formattedEndDate}`);
      } else {
        toggleSnackBar('No more invoice', { variant: 'warning' });
      }
    });
  };

  const exportToClickUp = () => {
    const data = {
      rows: rows,
      revisedBillableHour: searchInvoiceData?.searchInvoice?.hours,
      revisedAmount: searchInvoiceData?.searchInvoice?.amount,
      rate: searchInvoiceData?.searchInvoice?.rate,
      projectName: searchInvoiceData?.searchInvoice?.project?.name,
      notes: searchInvoiceData?.searchInvoice.comments,
      invoiceId: searchInvoiceData?.searchInvoice?.invoiceId,
      taskId: searchInvoiceData?.searchInvoice?.clickUpTask?.id,
      contractTypeId: searchInvoiceData?.searchInvoice?.project?.contractType?.id
    };
    navigate(Paths.EXPORT_INVOICE, { state: data });
  };

  const handleInvoiceUpdate = () => {
    if (project) {
      const { id, billableHours, rate } = project;

      const invoice = {
        projectId: id,
        startDate: startDate,
        endDate: endDate,
        hours: billableHours,
        rate: rate,
        amount: billableHours * rate
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
      }).then((r) => r.data && handleCloseDialog('update'));
    }
  };

  const handleEditHoursSubmit = (values: any) => {
    const { billableHours } = values;
    const totalHours = parseFloat(billableHours);

    if (project && startDate && endDate) {
      const { id, rate } = project;
      const amount = rate * totalHours;
      const invoice = {
        projectId: id,
        startDate: startDate,
        endDate: endDate,
        hours: totalHours,
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
      handleCloseDialog('edit');
    }
  };

  return (
    <Stack gap={5}>
      <Stack direction="row" justifyContent="space-between">
        <Button startIcon={<NavigateBeforeIcon />} onClick={handlePreviousInvoiceOnClick}>
          Previous Invoice
        </Button>
        <Button endIcon={<NavigateNextIcon />} onClick={handleNextInvoiceOnClick}>
          Next Invoice
        </Button>
      </Stack>
      <InvoiceDetailHeader
        projectName={searchInvoiceData?.searchInvoice?.project?.name}
        clickUpTaskUrl={searchInvoiceData?.searchInvoice?.clickUpTask?.url}
        startDate={startDate}
        endDate={endDate}
      />
      <InvoiceActionBar exportToClickUp={exportToClickUp} handleOpenDialog={handleOpenDialog} />
      <Stack direction="row" justifyContent="space-between" gap={4}>
        <DisplayCard
          id="Invoice billable hours"
          title="Current Invoice Billable Hours"
          data={
            <Stack gap={1} direction="row" alignItems="center">
              {searchInvoiceData?.searchInvoice?.hours}
              <Typography component="span" variant="caption" color="grey.500">
                hrs
              </Typography>
            </Stack>
          }
        />
        <DisplayCard id="Invoice Amount" title="Current Invoice Amount" data={searchInvoiceData && USDollar.format(searchInvoiceData.searchInvoice.amount)} />
        <DisplayCard
          id="Adjustment Hours"
          title="Adjustment Hours"
          data={
            <Stack gap={1} direction="row" alignItems="center">
              {searchInvoiceData && project && (searchInvoiceData.searchInvoice.hours - project.billableHours).toFixed(2)}
              <Typography component="span" variant="caption" color="grey.500">
                hrs
              </Typography>
            </Stack>
          }
        />
        <DisplayCard
          id="Original Billable Hours"
          title="Report Billable Hours"
          data={
            <Stack gap={1} direction="row" alignItems="center">
              {project?.billableHours}
              <Typography component="span" variant="caption" color="grey.500">
                hrs
              </Typography>
            </Stack>
          }
        />
        <DisplayCard id="Report invoice Amount" title="Report Amount" data={project && USDollar.format(project.billableHours * project.rate)} />
      </Stack>
      <Box sx={{ marginTop: '2rem' }}>
        <SortedBasicTable rows={rows} columns={columns} keyFun={keyFun} hidePagination defaultOrderBy="billableHours" />
      </Box>
      <Box sx={{ marginTop: 5 }}>
        <CommentInputBox onSubmit={handleOnSubmitComment} />
        <Divider sx={{ color: 'grey.400', fontSize: '0.8rem', marginTop: 5 }}>comments</Divider>
        <CommentDisplayComponent>
          <CommentList>
            {searchInvoiceData?.searchInvoice?.comments && searchInvoiceData.searchInvoice.comments.length > 0 ? (
              searchInvoiceData.searchInvoice.comments.map((item: any) => {
                return (
                  <CommentListItem
                    date={new Date(item.createDate)}
                    content={item.content}
                    onDelete={() => handleOnDelete(item.commentId)}
                    key={item.commentId}
                    deletable={item.deletable}
                  />
                );
              })
            ) : (
              <div>no comments</div>
            )}
          </CommentList>
        </CommentDisplayComponent>
      </Box>
      <FormDialog open={isOpenDialog.update} onClose={() => handleCloseDialog('update')}>
        <Stack gap={5}>
          <Typography variant="h6">Update Invoice</Typography>
          <Stack gap={3}>
            <Typography variant="subtitle2" color="warning.main">
              This will override current invoice.
            </Typography>
            <Stack>
              <Typography variant="subtitle2">From:</Typography>
              <Typography>{`${searchInvoiceData?.searchInvoice.hours} hours - $${searchInvoiceData?.searchInvoice.amount}`}</Typography>
            </Stack>
            <Stack>
              <Typography variant="subtitle2">To:</Typography>
              <Typography>{`${project?.billableHours} hours - $${project && project?.billableHours * project?.rate}`}</Typography>
            </Stack>
            <Typography>Are you certain about proceeding with this update?</Typography>
          </Stack>
          <Stack direction="row" gap={2} justifyContent="end">
            <Button color="error" variant="contained" onClick={handleInvoiceUpdate}>
              update
            </Button>
            <Button color="secondary" variant="outlined" onClick={() => handleCloseDialog('update')}>
              cancel
            </Button>
          </Stack>
        </Stack>
      </FormDialog>
      <FormDialog open={isOpenDialog.edit} onClose={() => handleCloseDialog('edit')}>
        <Stack gap={5}>
          <Typography variant="h6">Update Total Billable Hours</Typography>
          <Formik
            initialValues={{ billableHours: searchInvoiceData?.searchInvoice.hours.toString() || '' }}
            validationSchema={FormValidation}
            enableReinitialize={true}
            onSubmit={(values) => handleEditHoursSubmit(values)}
          >
            <Form>
              <Stack gap={3}>
                <ObserverTextInput id="billableHours" name="billableHours" type="number" label="Billable Hours" placeholder="Billable Hours" variant="outlined" fullWidth />
                <Button variant="contained" type="submit" fullWidth>
                  Submit
                </Button>
              </Stack>
            </Form>
          </Formik>
        </Stack>
      </FormDialog>
      <FormDialog open={isOpenDialog.delete} onClose={() => handleCloseDialog('delete')}>
        <Stack gap={5}>
          <Typography variant="h6">Delete Invoice</Typography>
          <Typography variant="body1">Are you sure you want to delete this invoice?</Typography>
          <Stack direction="row" gap={2} justifyContent="end">
            <Button color="error" variant="contained" onClick={handleDeleteInvoice}>
              delete
            </Button>
            <Button color="secondary" variant="outlined" onClick={() => handleCloseDialog('delete')}>
              cancel
            </Button>
          </Stack>
        </Stack>
      </FormDialog>
    </Stack>
  );
};
