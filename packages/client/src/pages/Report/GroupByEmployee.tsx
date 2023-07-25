import { CollapsibleTable } from '@pages/Report/components/table/CollapsibleTable';
import { Box, Button, Stack, Typography } from '@mui/material';
import React, { FC } from 'react';

import { useGetEmployeesWithRecordQuery, useSendSlackMessageMutation } from '@graphql/employee/employee';
import { formatDateToDashFormat } from '../../utils/helperFun';
import { CustomizedAccordions } from '@pages/Report/components/CustomizedAccordions';
import { SlackIcon } from '@components/icons/SlackIcon';
import { FormDialog } from '@components/form/FormDialog';
import { format } from 'date-fns';
import { FormTextArea } from '@pages/Invoice/Export';
import { Form, Formik, FormikValues } from 'formik';
import * as Yup from 'yup';
import { Banner } from '@components/Banner';
import { useTimeout } from '../../utils/useTimeOutHook';

interface GroupByEmployeeProps {
  startDate: Date;
  endDate: Date;
  searchText?: string;
}

const FormValidation = Yup.object({
  message: Yup.string().required('Message is required')
});

export const GroupByEmployee: FC<GroupByEmployeeProps> = ({ startDate, endDate, searchText }) => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [sendSlackMessage] = useSendSlackMessageMutation();
  const [showBanner, setShowBanner] = React.useState({
    show: false,
    content: '',
    state: '' as 'success' | 'error' | 'info'
  });
  const [targetReceiver, setTargetReceiver] = React.useState<{ employeeId: string; name: string }>({ employeeId: '', name: '' });

  const { data } = useGetEmployeesWithRecordQuery({
    variables: {
      startDate: formatDateToDashFormat(startDate),
      endDate: formatDateToDashFormat(endDate)
    },
    fetchPolicy: 'cache-and-network'
  });
  const rows = data ? data.getEmployeesWithRecord.filter((employee) => employee.workHours !== 0) : [];
  const filteredRows = rows.filter((row) => {
    return row.name.toLowerCase().includes(searchText?.toLowerCase() as string);
  });
  const zeroWorkHoursWithActiveEmployeesRows = data?.getEmployeesWithRecord?.filter((row) => row.workHours === 0 && row.status === 'Active') ?? [];

  // outer table column name and render config
  const tableConfig = {
    outer: [
      {
        id: 'name',
        name: 'Employees',
        render: (row: any) => row.name
      },
      {
        id: 'workHours',
        name: 'Work Hours',
        render: (row: any) => row.workHours
      },
      {
        id: 'indirectHours',
        name: 'Indirect Hours',
        render: (row: any) => row.indirectHours
      },
      {
        id: 'billableHours',
        name: 'Billable Hours (Work + Indirect)',
        render: (row: any) => row.billableHours
      },
      {
        id: 'actions',
        name: 'Actions',
        render: (row: any) => (
          <Button variant="outlined" endIcon={<SlackIcon />} onClick={() => handleOpenFormDialog(row)}>
            Notify
          </Button>
        )
      }
    ],
    inner: [
      {
        id: 'projectName',
        name: 'Name',
        render: (row: any) => row.projectName
      },
      {
        id: 'projectIsBillable',
        name: 'IsBillable',
        render: (row: any) => {
          return (
            <Box
              sx={row.isBillable ? { backgroundColor: 'success.light', color: 'success.main' } : { backgroundColor: 'error.light', color: 'error.main' }}
              width={40}
              height={20}
              textAlign="center"
              borderRadius="3px"
            >
              {row.isBillable.toString()}
            </Box>
          );
        }
      },
      {
        id: 'projectWorkHours',
        name: 'Work Hours',
        render: (row: any) => row.projectWorkHours
      },
      {
        id: 'projectIndirectHours',
        name: 'Indirect Hours',
        render: (row: any) => row.projectIndirectHours
      },
      {
        id: 'projectPercentage',
        name: 'Percentage',
        render: (row: any) => row.projectPercentage + '%'
      }
    ]
  };

  const handleSendSlack = (values: FormikValues) => {
    sendSlackMessage({
      variables: {
        inputs: {
          employeeId: targetReceiver.employeeId,
          message: values.message
        }
      }
    }).then((r) => {
      if (r?.data?.sendSlackMessage) {
        handleCloseFormDialog();
        setShowBanner({ show: true, content: `Successfully sent the slack message to ${targetReceiver.name}`, state: 'success' });
        return;
      }

      setShowBanner({ show: true, content: 'Error to send the slack message', state: 'error' });
    });
  };

  const handleCloseFormDialog = () => setOpenDialog(false);

  const handleOpenFormDialog = (user: any) => {
    setOpenDialog(true);
    setTargetReceiver({ employeeId: user.id, name: user.name });
  };

  useTimeout(() => setShowBanner((prevState) => ({ ...prevState, show: false })), 1000, showBanner.show);

  return (
    <Stack gap={5}>
      {showBanner.show && showBanner.state === 'success' && <Banner content={showBanner.content} state={showBanner.state} />}
      <CollapsibleTable rows={filteredRows} tableConfig={tableConfig} innerTitle="Project" startDate={startDate} endDate={endDate} />
      {rows.length === 0 && <Box sx={{ textAlign: 'start' }}>No data</Box>}
      <CustomizedAccordions summary="See employees who has not submit their work hours">
        <Stack gap={2}>
          {zeroWorkHoursWithActiveEmployeesRows.length === 0 ? (
            <Typography>No data</Typography>
          ) : (
            <CollapsibleTable rows={zeroWorkHoursWithActiveEmployeesRows} tableConfig={tableConfig} innerTitle="Project" startDate={startDate} endDate={endDate} />
          )}
        </Stack>
        <FormDialog open={openDialog} onClose={handleCloseFormDialog}>
          {showBanner.show && showBanner.state === 'error' && <Banner content={showBanner.content} state={showBanner.state} />}
          <Typography variant="h6" sx={{ mb: 4 }}>
            Send Slack Notification
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Are you sure you want to send notification to <strong>{targetReceiver.name}</strong>?
          </Typography>
          <Formik
            validationSchema={FormValidation}
            enableReinitialize={true}
            initialValues={{ message: `Hi ${targetReceiver.name}, please log your time between ${format(startDate, 'MMM dd yyyy')} to ${format(endDate, 'MMM dd yyyy')}.` }}
            onSubmit={(values) => handleSendSlack(values)}
          >
            <Form>
              <FormTextArea name="message" minRows={4} />
              <Stack direction="row" gap={2} justifyContent="end" marginTop={3}>
                <Button color="error" variant="contained" type="submit">
                  send
                </Button>
                <Button color="secondary" variant="outlined" onClick={handleCloseFormDialog}>
                  cancel
                </Button>
              </Stack>
            </Form>
          </Formik>
        </FormDialog>
      </CustomizedAccordions>
    </Stack>
  );
};
