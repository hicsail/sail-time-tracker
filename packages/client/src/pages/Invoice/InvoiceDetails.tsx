import { Box, Button, Divider, Stack, Tooltip, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGetProjectWithEmployeeRecordsQuery } from '@graphql/employee/employee';
import { convertToUTCDate, formatDateToDashFormat, USDollar } from '../../utils/helperFun';
import IconButton from '@mui/material/IconButton';
import { FormDialog } from '@components/form/FormDialog';
import { useEffect, useState } from 'react';
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
import { BasicTable } from '@pages/Invoice/components/table/BasicTable';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import { Paths } from '@constants/paths';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Banner } from '@components/Banner';

const columns: any[] = [
  {
    field: 'employeeName',
    headerName: 'Employee Name',
    width: 200,
    renderCell: (row: any) => row.employeeName
  },
  { field: 'workHours', headerName: 'Work Hours', width: 200 },
  { field: 'indirectHours', headerName: 'Indirect Hours', width: 200 },
  { field: 'billableHours', headerName: 'Billable Hours', width: 200 },
  { field: 'amount', headerName: 'Amount', width: 200, renderCell: (row: any) => USDollar.format(row.amount) }
];

const FormValidation = Yup.object({
  billableHours: Yup.number().required('Required').min(0, 'Must be greater than 0')
});

export const InvoiceDetails = () => {
  const [isOpenedEditDialog, setIsOpenedEditDialog] = useState(false);
  const [isOpenedDeleteDialog, setIsOpenedDeleteDialog] = useState(false);
  const [isOpenedExportDialog, setIsOpenedExportDialog] = useState(false);
  const [isDisplayBanner, setDisplayBanner] = useState(false);
  const [deleteInvoice] = useDeleteInvoiceMutation();
  const { id, startDate, endDate } = useParams();
  const { data: projectWithEmployeeData } = useGetProjectWithEmployeeRecordsQuery({
    variables: {
      startDate: startDate,
      endDate: endDate
    },
    fetchPolicy: 'cache-and-network'
  });

  const project = projectWithEmployeeData?.getProjectWithEmployeeRecords.find((project) => project.id === id);
  const [createOrUpdateInvoiceMutation] = useCreateOrUpdateInvoiceMutation();
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
  const [findPreviousInvoice] = useFindPreviousInvoiceLazyQuery();
  const [findNextInvoice] = useFindNextInvoiceLazyQuery();
  const navigate = useNavigate();

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

  const handleCloseDeleteDialog = () => setIsOpenedDeleteDialog(false);
  const handleOpenDeleteDialog = () => setIsOpenedDeleteDialog(true);
  const handleCloseEditDialog = () => setIsOpenedEditDialog(false);
  const handleOpenEditDialog = () => setIsOpenedEditDialog(true);
  const handleCloseExportDialog = () => setIsOpenedExportDialog(false);
  const handleOpenExportDialog = () => setIsOpenedExportDialog(true);

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
        setDisplayBanner(true);
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
        setDisplayBanner(true);
      }
    });
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDisplayBanner(false);
    }, 800);

    return () => clearTimeout(timerId);
  }, [isDisplayBanner]);

  return (
    <>
      {isDisplayBanner && <Banner content={`No more invoice`} state="info" />}
      <Box sx={{ height: 'auto', margin: 'auto', paddingTop: 8 }}>
        <Stack direction="row" justifyContent="space-between">
          <Button startIcon={<NavigateBeforeIcon />} onClick={handlePreviousInvoiceOnClick}>
            Previous Invoice
          </Button>
          <Button endIcon={<NavigateNextIcon />} onClick={handleNextInvoiceOnClick}>
            Next Invoice
          </Button>
        </Stack>
        <Box sx={{ marginTop: 5 }}>
          <h3>{`Project Name: ${project?.name}`}</h3>
          <Box sx={{ display: 'flex', alignItem: 'center', gap: 1 }}>
            <CalendarTodayIcon />
            <div>
              {startDate && startDate.split('-').join('/')} - {endDate && endDate.split('-').join('/')}
            </div>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, marginTop: 5, '& .MuiButtonBase-root': { color: 'grey.600' } }}>
          <Tooltip title="edit hours" onClick={handleOpenEditDialog}>
            <IconButton>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="export to clickup" onClick={() => navigate(Paths.EXPORT_INVOICE)}>
            <IconButton>
              <SendIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="delete" onClick={handleOpenDeleteDialog}>
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <FormDialog open={isOpenedEditDialog} onClose={() => handleCloseEditDialog}>
          <Typography variant="h6">Update Total Billable Hours</Typography>
          <Formik
            initialValues={{ billableHours: searchInvoiceData?.searchInvoice.hours.toString() || '' }}
            validationSchema={FormValidation}
            enableReinitialize={true}
            onSubmit={(values) => {
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
                handleCloseEditDialog();
              }
            }}
          >
            <Form>
              <ObserverTextInput
                id="billableHours"
                name="billableHours"
                type="number"
                label="Billable Hours"
                placeholder="Billable Hours"
                sx={{ width: '100%', marginTop: 2 }}
                fullWidth
              />
              <Button variant="contained" sx={{ width: '100%', marginTop: 3 }} type="submit">
                Submit
              </Button>
            </Form>
          </Formik>
        </FormDialog>
        <FormDialog open={isOpenedDeleteDialog} onClose={handleCloseDeleteDialog}>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Delete Invoice
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Are you sure you want to delete this invoice?
          </Typography>
          <Stack direction="row" gap={2} justifyContent="end">
            <Button color="error" variant="contained" onClick={handleDeleteInvoice}>
              delete
            </Button>
            <Button color="secondary" variant="outlined" onClick={handleCloseDeleteDialog}>
              cancel
            </Button>
          </Stack>
        </FormDialog>
        <Stack direction="row" justifyContent="space-between" marginTop={5}>
          <DisplayCard id="Original billable hours" title="Original Billable Hour" data={project?.billableHours} />
          <DisplayCard id="Original billable hours" title="Original Invoice Amount" data={project && USDollar.format(project.billableHours * 65)} />
          <DisplayCard
            id="Original billable hours"
            title="Adjustment Hours"
            data={searchInvoiceData && project && (searchInvoiceData.searchInvoice.hours - project.billableHours).toFixed(2)}
          />
          <DisplayCard id="Original billable hours" title="Revised total billable hours" data={searchInvoiceData?.searchInvoice?.hours} />
          <DisplayCard id="Original billable hours" title="Revised Invoice Amount" data={searchInvoiceData && USDollar.format(searchInvoiceData.searchInvoice.amount)} />
        </Stack>
        <Box sx={{ marginTop: '2rem' }}>
          <BasicTable rows={rows} columns={columns} keyFun={keyFun} hidePagination />
        </Box>
        <Box sx={{ marginTop: 5 }}>
          <CommentInputBox onSubmit={handleOnSubmitComment} />
          <Divider sx={{ color: 'grey.400', fontSize: '0.8rem', marginTop: 5 }}>comments</Divider>
          <CommentDisplayComponent>
            <CommentList>
              {searchInvoiceData && searchInvoiceData.searchInvoice.comments.length > 0 ? (
                searchInvoiceData.searchInvoice.comments.map((item: any) => {
                  return <CommentListItem date={new Date(item.createDate)} content={item.content} onDelete={() => handleOnDelete(item.commentId)} key={item.commentId} />;
                })
              ) : (
                <div>no comments</div>
              )}
            </CommentList>
          </CommentDisplayComponent>
        </Box>
      </Box>
    </>
  );
};
