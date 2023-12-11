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
import { CommentInputBox } from '@pages/invoice/components/comment/CommentInputBox';
import { useAddCommentMutation, useDeleteCommentMutation } from '@graphql/comment/comment';
import { CommentDisplayComponent } from '@pages/invoice/components/comment/CommentDisplayComponent';
import { CommentListItem } from '@pages/invoice/components/comment/CommentListItem';
import { CommentList } from '@pages/invoice/components/comment/CommentList';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { ObserverTextInput } from '@components/form/ObserverTextInput';
import { Paths } from '@constants/paths';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { SortedBasicTable } from '@components/table/SortedBasicTable';
import { useSnackBar } from '@context/snackbar.context';
import { InvoiceActionBar } from '@pages/invoice/invoice-detail/InvoiceActionBar';
import { InvoiceDetailHeader } from '@pages/invoice/invoice-detail/InvoiceDetailHeader';
import { FormObserver } from '@pages/invoice/components/form/FormObserver';
import { InvoiceDisplayCards } from '@pages/invoice/invoice-detail/InvoiceDisplayCards';

const isOpenDialogInitialValue = {
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

  const editedRenderCell = (name: string, row: any) => {
    const formValidation = Yup.object({
      [name]: Yup.number().min(0, 'Must be greater than 0')
    });

    const employee: any = searchInvoiceData?.searchInvoice.items?.find((item) => item.employee.id === row.id);

    return (
      <Formik initialValues={{ [name]: employee ? employee[name] : '' }} onSubmit={() => {}} validateOnBlur={true} validationSchema={formValidation}>
        <Form>
          <FormObserver
            invoiceId={searchInvoiceData?.searchInvoice.invoiceId}
            row={row}
            name={name}
            searchInvoiceVariable={searchInvoiceVariable}
            handleOnSubmitComment={handleOnSubmitComment}
          />
          <ObserverTextInput name={name} type="number" />
        </Form>
      </Formik>
    );
  };

  const columns: any[] = [
    {
      field: 'employeeName',
      headerName: 'employee Name',
      width: 200,
      renderCell: (row: any) => row.employeeName
    },
    { field: 'workHours', headerName: 'Work Hours', width: 200, sortValue: (row: any) => row.workHours },
    {
      field: 'editedWorkHours',
      headerName: 'Edited Work Hours',
      width: 200,
      sortValue: (row: any) => row.workHours,
      renderCell: (row: any) => editedRenderCell('workHours', row)
    },
    { field: 'indirectHours', headerName: 'Indirect Hours', width: 200, sortValue: (row: any) => row.indirectHours },
    {
      field: 'editedIndirectHours',
      headerName: 'Edited Indirect Hours',
      width: 200,
      sortValue: (row: any) => row.indirectHours,
      renderCell: (row: any) => editedRenderCell('indirectHours', row)
    },
    { field: 'billableHours', headerName: 'Billable Hours', width: 200, sortValue: (row: any) => row.billableHours },
    {
      field: 'editedBillableHours',
      headerName: 'Edited Billable Hours',
      width: 200,
      sortValue: (row: any) => row.billableHours,
      renderCell: (row: any) => searchInvoiceData?.searchInvoice.items?.find((item) => item.employee.id === row.id)?.billableHours
    },
    { field: 'amount', headerName: 'Amount', width: 200, renderCell: (row: any) => USDollar.format(row.amount), sortValue: (row: any) => row.amount },
    {
      field: 'editedAmount',
      headerName: 'Edited Amount',
      width: 200,
      renderCell: (row: any) => {
        const editedAmount = searchInvoiceData?.searchInvoice.items?.find((item) => item.employee.id === row.id)?.amount;
        return editedAmount ? USDollar.format(editedAmount) : '';
      },
      sortValue: (row: any) => row.amount
    }
  ];

  const rows =
    project?.inner
      ?.filter((employee) => employee.employeeWorkHours !== 0)
      ?.map((employee) => {
        const { employeeName, employeeId, employeeWorkHours, employeeIndirectHours } = employee;
        const billableHours = employeeIndirectHours + employeeWorkHours;
        const amount = billableHours * project.rate;
        return {
          employeeName,
          id: employeeId,
          workHours: employeeWorkHours,
          indirectHours: employeeIndirectHours,
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
    const rows = searchInvoiceData?.searchInvoice?.items?.map((item) => {
      const { employee, workHours, indirectHours, billableHours, amount } = item;
      return {
        employeeName: employee.name,
        workHours: workHours,
        indirectHours: indirectHours,
        billableHours: billableHours,
        amount: amount
      };
    });

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
      <InvoiceDisplayCards
        invoiceBillableHours={searchInvoiceData?.searchInvoice?.hours}
        invoiceAmount={searchInvoiceData && USDollar.format(searchInvoiceData.searchInvoice.amount)}
        adjustingHours={searchInvoiceData && project && (searchInvoiceData.searchInvoice.hours - project.billableHours).toFixed(2)}
        reportBillableHours={project?.billableHours}
        reportAmount={project && USDollar.format(project.billableHours * project.rate)}
      />
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
