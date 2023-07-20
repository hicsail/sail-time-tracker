import { Box, Button, Divider, Stack, Tooltip, Typography } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useGetProjectWithEmployeeRecordsQuery } from '@graphql/employee/employee';
import { convertToUTCDate, formatDateToDashFormat, USDollar } from '../../utils/helperFun';
import IconButton from '@mui/material/IconButton';
import UpdateIcon from '@mui/icons-material/Update';
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
import { ClickUpIcon } from '@components/icons/ClickupIcon';
import { ClickUpMobile } from '@components/icons/ClickupMobile';

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

const isOpenDialogInitialValue = {
  edit: false,
  delete: false,
  update: false
};

export const InvoiceDetails = () => {
  const [isOpenDialog, setIsOpenDialog] = useState(isOpenDialogInitialValue);
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

  const exportToClickUp = () => {
    const data = {
      rows: rows,
      revisedBillableHour: searchInvoiceData?.searchInvoice?.hours,
      revisedAmount: searchInvoiceData?.searchInvoice?.amount,
      rate: project?.rate,
      projectName: project?.name,
      notes: searchInvoiceData?.searchInvoice.comments,
      invoiceId: searchInvoiceData?.searchInvoice?.invoiceId,
      taskId: searchInvoiceData?.searchInvoice?.clickUpTask?.id
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
          <h3>
            {`Project Name: ${project?.name}`}
            {searchInvoiceData?.searchInvoice?.clickUpTask?.url && (
              <Tooltip title="clickup task">
                <Link to={searchInvoiceData?.searchInvoice?.clickUpTask?.url ?? ''} target="_blank">
                  <IconButton>
                    <ClickUpIcon fontSize="large" />
                  </IconButton>
                </Link>
              </Tooltip>
            )}
          </h3>
          <Box sx={{ display: 'flex', alignItem: 'center', gap: 1 }}>
            <CalendarTodayIcon />
            <div>
              {startDate && startDate.split('-').join('/')} - {endDate && endDate.split('-').join('/')}
            </div>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, marginTop: 5, '& .MuiButtonBase-root': { color: 'grey.600' }, alignItems: 'center' }}>
          <Tooltip title="update invoice" onClick={() => handleOpenDialog('update')}>
            <IconButton>
              <UpdateIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="edit hours" onClick={() => handleOpenDialog('edit')}>
            <IconButton>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="delete" onClick={() => handleOpenDialog('delete')}>
            <IconButton>
              <SendIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="export to clickup" onClick={exportToClickUp}>
            <IconButton sx={{ position: 'relative' }}>
              <ClickUpMobile fontSize="large" />
              <SendIcon
                sx={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '5px',
                  fontSize: '15px',
                  backgroundColor: 'primary.light',
                  borderRadius: '50%',
                  color: 'white',
                  padding: '2px'
                }}
              />
            </IconButton>
          </Tooltip>
        </Box>
        <FormDialog open={isOpenDialog.update} onClose={() => handleCloseDialog('update')}>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Update Invoice
          </Typography>
          <Stack sx={{ mb: 4 }} gap={2}>
            <Typography variant="subtitle2" color="warning.main">
              This will override current invoice.
            </Typography>
            <Stack>
              <Typography variant="subtitle2">From:</Typography>
              <Typography variant="body1">{`${searchInvoiceData?.searchInvoice.hours} hours - $${searchInvoiceData?.searchInvoice.amount}`}</Typography>
            </Stack>
            <Stack>
              <Typography variant="subtitle2">To:</Typography>
              <Typography variant="body1">{`${project?.billableHours} hours - $${project && project?.billableHours * project?.rate}`}</Typography>
            </Stack>
            <Typography variant="body1">Are you certain about proceeding with this update?</Typography>
          </Stack>
          <Stack direction="row" gap={2} justifyContent="end">
            <Button color="error" variant="contained" onClick={handleInvoiceUpdate}>
              update
            </Button>
            <Button color="secondary" variant="outlined" onClick={() => handleCloseDialog('update')}>
              cancel
            </Button>
          </Stack>
        </FormDialog>
        <FormDialog open={isOpenDialog.edit} onClose={() => handleCloseDialog('edit')}>
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
                handleCloseDialog('edit');
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
        <FormDialog open={isOpenDialog.delete} onClose={() => handleCloseDialog('delete')}>
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
            <Button color="secondary" variant="outlined" onClick={() => handleCloseDialog('delete')}>
              cancel
            </Button>
          </Stack>
        </FormDialog>
        <Stack direction="row" justifyContent="space-between" marginTop={5} gap={4}>
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
          <DisplayCard id="Report invoice Amount" title="Report Amount" data={project && USDollar.format(project.billableHours * 65)} />
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
      </Box>
    </>
  );
};
