import { CollapsibleTable } from '@pages/report/components/table/CollapsibleTable';
import { Autocomplete, Box, Button, Checkbox, Chip, IconButton, ListItem, Stack, Tooltip, Typography } from '@mui/material';
import React, { FC, useState } from 'react';

import {
  GetEmployeesWithRecordDocument,
  GetProjectWithEmployeeRecordsDocument,
  useBatchSendSlackMessageMutation,
  useGetEmployeesWithRecordQuery,
  useSendSlackMessageMutation
} from '@graphql/employee/employee';
import { formatDateToDashFormat } from '../../utils/helperFun';
import { CustomizedAccordions } from '@pages/report/components/CustomizedAccordions';
import { SlackIcon } from '@components/icons/SlackIcon';
import { FormDialog } from '@components/form/FormDialog';
import { endOfMonth, format, getMonth, getYear, startOfMonth } from 'date-fns';
import { FormTextArea } from '@pages/invoice/Export';
import { Form, Formik, FormikValues } from 'formik';
import * as Yup from 'yup';
import { Banner } from '@components/Banner';
import { useTimeout } from '../../hooks/useTimeOutHook';
import { CustomOutlinedTextInput } from '@components/StyledComponent';
import { Check, CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import { SortedCollapsibleTable } from '@pages/report/components/table/SortedCollapsibleTable';
import { ReportFormObserver } from '@pages/report/components/ReportFormObserver';
import { ObserverTextInput } from '@components/form/ObserverTextInput';
import { useIsEdit } from '@pages/report/components/useIsEdit';
import { useCreateOrUpdateBillableHoursMutation } from '@graphql/billable-hours/billable-hours';

interface GroupByEmployeeProps {
  startDate: Date;
  endDate: Date;
  searchText?: string;
}

const FormValidation = Yup.object({
  message: Yup.string().required('Message is required')
});

const BillableHoursValidation = Yup.object({
  billableHours: Yup.number().required('Billable hours is required')
});

export const GroupByEmployee: FC<GroupByEmployeeProps> = ({ startDate, endDate, searchText }) => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [sendSlackMessage] = useSendSlackMessageMutation();
  const [sendBatchSlackMessage] = useBatchSendSlackMessageMutation();
  const [selectedEmployees, setSelectedEmployees] = useState<any[]>([]);
  const [createOrUpdateBillableHours] = useCreateOrUpdateBillableHoursMutation();
  const [showBanner, setShowBanner] = React.useState({
    show: false,
    content: '',
    state: '' as 'success' | 'error' | 'info'
  });
  const [targetReceiver, setTargetReceiver] = React.useState<{ employeeId: string; name: string } | null>({ employeeId: '', name: '' });

  const { data } = useGetEmployeesWithRecordQuery({
    variables: {
      startDate: formatDateToDashFormat(startDate),
      endDate: formatDateToDashFormat(endDate)
    },
    fetchPolicy: 'network-only'
  });
  const rows = data ? data.getEmployeesWithRecord.filter((employee) => employee.workHours !== 0) : [];
  const filteredRows = rows.filter((row) => {
    return row.name.toLowerCase().includes(searchText?.toLowerCase() as string);
  });

  const zeroWorkHoursWithActiveEmployeesRows = data?.getEmployeesWithRecord?.filter((row) => row.workHours === 0 && row.status === 'Active') ?? [];
  const zeroWorkHoursWithActiveEmployees = zeroWorkHoursWithActiveEmployeesRows.map((employee) => {
    return { id: employee.id, name: employee.name };
  });
  const { isEdit } = useIsEdit();

  const savePrecalculatedHours = (employeeId: string, projectId: string, precalculatedHours: number, value: number) => {
    if (getYear(startDate) !== getYear(endDate) || getMonth(startDate) !== getMonth(endDate)) {
      return;
    }

    createOrUpdateBillableHours({
      variables: {
        input: {
          startDate: startOfMonth(startDate),
          endDate: endOfMonth(startDate),
          employeeId: employeeId,
          projectId: projectId,
          precalculatedHours: precalculatedHours,
          billableHours: value
        }
      },
      refetchQueries: [
        {
          query: GetEmployeesWithRecordDocument,
          variables: {
            startDate: formatDateToDashFormat(startDate),
            endDate: formatDateToDashFormat(endDate)
          }
        },
        {
          query: GetProjectWithEmployeeRecordsDocument,
          variables: {
            startDate: formatDateToDashFormat(startDate),
            endDate: formatDateToDashFormat(endDate)
          }
        }
      ]
    });
  };

  // outer table column name and render config
  const tableConfig = {
    outer: [
      {
        field: 'name',
        name: 'Employees',
        render: (row: any) => row.name
      },
      {
        field: 'workHours',
        name: 'Direct',
        render: (row: any) => row.workHours,
        sortValue: (row: any) => row.workHours
      },
      {
        field: 'indirectHours',
        name: 'Indirect',
        render: (row: any) => row.indirectHours,
        sortValue: (row: any) => row.indirectHours
      },
      {
        field: 'precalculatedHours',
        name: 'Precalculated',
        render: (row: any) => row.precalculatedHours,
        sortValue: (row: any) => row.precalculatedHours
      },
      {
        field: 'billableHours',
        name: 'Billable Hours',
        render: (row: any) => row.billableHours,
        sortValue: (row: any) => row.billableHours
      },
      {
        field: 'percentage',
        name: '%',
        render: () => 'N/A'
      },
      {
        field: 'percentage',
        name: 'isBillable',
        render: () => 'N/A'
      },
      {
        field: 'actions',
        name: 'Actions',
        render: (row: any) => (
          <Tooltip title="Send slack message">
            <IconButton onClick={() => handleOpenFormDialog(row)} size="small">
              <SlackIcon />
            </IconButton>
          </Tooltip>
        )
      }
    ],
    inner: [
      {
        field: 'projectName',
        name: 'Project Name',
        render: (row: any) => row.projectName
      },
      {
        field: 'projectWorkHours',
        name: 'Direct',
        render: (row: any) => row.projectWorkHours
      },
      {
        field: 'projectIndirectHours',
        name: 'Indirect',
        render: (row: any) => row.projectIndirectHours
      },
      {
        field: 'precalculatedHours',
        name: 'Precalculated',
        render: (row: any) => row.precalculatedHours
      },
      {
        field: 'billableHours',
        name: 'Billable Hours',
        render: (row: any) => {
          const { employeeId, projectId, precalculatedHours, billableHours } = row;
          const key = `${row.employeeId}#${row.projectId}`;
          return (
            <Formik validateOnChange={true} initialValues={{ [key]: billableHours }} validationSchema={BillableHoursValidation} enableReinitialize={true} onSubmit={() => {}}>
              <Form>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <ReportFormObserver employeeId={employeeId} projectId={projectId} startDate={startDate} endDate={endDate} id={key} precalculatedHours={precalculatedHours} />
                  <ObserverTextInput name={key} type="number" sx={{ width: '70px' }} disabled={!isEdit} size="small" />
                </Box>
              </Form>
            </Formik>
          );
        }
      },
      {
        field: 'projectPercentage',
        name: '%',
        render: (row: any) => row.projectPercentage + '%'
      },
      {
        field: 'projectIsBillable',
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
        field: 'action',
        name: 'action',
        render: (row: any) => {
          const { employeeId, projectId, precalculatedHours } = row;
          return (
            <Tooltip
              title="Record precalculated hours"
              onClick={() => {
                savePrecalculatedHours(employeeId, projectId, precalculatedHours, precalculatedHours);
              }}
            >
              <IconButton size="small">
                <Check />
              </IconButton>
            </Tooltip>
          );
        }
      }
    ]
  };

  const handleSendSlack = (values: FormikValues) => {
    targetReceiver &&
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

  const handleSendBatchSlack = (values: FormikValues) => {
    if (selectedEmployees.length !== 0) {
      sendBatchSlackMessage({
        variables: {
          input: {
            employeeIds: selectedEmployees,
            message: values.message
          }
        }
      }).then((r) => {
        if (r?.data?.batchSendingMessages.success) {
          handleCloseFormDialog();
          setShowBanner({ show: true, content: `Successfully sent ${r.data.batchSendingMessages.count} slack message.`, state: 'success' });
          return;
        }
        setShowBanner({ show: true, content: `Error to send ${r?.data?.batchSendingMessages.count} slack message.`, state: 'error' });
      });
    }
  };

  const handleCloseFormDialog = () => setOpenDialog(false);

  const handleOpenFormDialog = (user: any) => {
    setOpenDialog(true);
    user ? setTargetReceiver({ employeeId: user.id, name: user.name }) : setTargetReceiver(null);
  };

  useTimeout(() => setShowBanner((prevState) => ({ ...prevState, show: false })), 1000, showBanner.show);

  return (
    <Stack gap={5}>
      <Stack gap={5}>
        {showBanner.show && showBanner.state === 'success' && <Banner content={showBanner.content} state={showBanner.state} />}
        <SortedCollapsibleTable rows={filteredRows} tableConfig={tableConfig} startDate={startDate} endDate={endDate} />
        {rows.length === 0 && <Box sx={{ textAlign: 'start' }}>No data</Box>}
      </Stack>
      <CustomizedAccordions summary="See employees who has not submit their work hours">
        <Stack gap={2}>
          <Button sx={{ flexBasis: '50px' }} variant="outlined" endIcon={<SlackIcon />} onClick={() => handleOpenFormDialog(null)}>
            Send All
          </Button>
          {zeroWorkHoursWithActiveEmployeesRows.length === 0 ? (
            <Typography>No data</Typography>
          ) : (
            <CollapsibleTable rows={zeroWorkHoursWithActiveEmployeesRows} tableConfig={tableConfig} startDate={startDate} endDate={endDate} />
          )}
        </Stack>
        <FormDialog open={openDialog} onClose={handleCloseFormDialog}>
          {showBanner.show && showBanner.state === 'error' && <Banner content={showBanner.content} state={showBanner.state} />}
          <Typography variant="h6" sx={{ mb: 4 }}>
            Send Slack Notification
          </Typography>
          {targetReceiver ? (
            <Typography variant="body1" sx={{ mb: 4 }}>
              Are you sure you want to send notification to <strong>{targetReceiver.name}</strong>?
            </Typography>
          ) : (
            <Stack>
              <Autocomplete
                sx={{ width: 500, backgroundColor: (theme) => (theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.grey['800']) }}
                multiple
                options={zeroWorkHoursWithActiveEmployees ?? []}
                defaultValue={zeroWorkHoursWithActiveEmployees ?? []}
                disableCloseOnSelect
                getOptionLabel={(option) => option.name}
                renderOption={(props, option, { selected }) => {
                  return (
                    <ListItem {...props} sx={{ backgroundColor: (theme) => (theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.grey['800']) }}>
                      <Checkbox icon={<CheckBoxOutlineBlank fontSize="small" />} checkedIcon={<CheckBox fontSize="small" />} style={{ marginRight: 8 }} checked={selected} />
                      {option.name}
                    </ListItem>
                  );
                }}
                renderInput={(params) => <CustomOutlinedTextInput {...params} placeholder="Employees" />}
                renderTags={(value, getTagProps) => value.map((option, index) => <Chip label={option.name} {...getTagProps({ index })} sx={{ borderRadius: '5px' }} />)}
                onChange={(event, newValue) => {
                  setSelectedEmployees(newValue.map((v) => v.id));
                }}
              />
              <Typography variant="body1" sx={{ mb: 4, mt: 4 }}>
                Are you sure you want to send notification to {selectedEmployees.length} employees?
              </Typography>
            </Stack>
          )}
          <Formik
            validationSchema={FormValidation}
            enableReinitialize={true}
            initialValues={{
              message: targetReceiver
                ? `Hi ${targetReceiver.name}, please log your time between ${format(startDate, 'MMM dd yyyy')} to ${format(endDate, 'MMM dd yyyy')}.`
                : `Hi folks, please log your time between ${format(startDate, 'MMM dd yyyy')} to ${format(endDate, 'MMM dd yyyy')}.`
            }}
            onSubmit={(values) => {
              targetReceiver ? handleSendSlack(values) : handleSendBatchSlack(values);
            }}
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
