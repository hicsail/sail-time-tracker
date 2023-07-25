import { Backdrop, Box, Button, CircularProgress, FormControl, MenuItem, Stack, TextareaAutosizeProps, Typography } from '@mui/material';
import { StyledTextarea } from '@components/StyledComponent';
import { ObserverTextInput } from '@components/form/ObserverTextInput';
import { Form, Formik, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { StyledPaper } from '@components/StyledPaper';
import { FC, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAddCommentMutation } from '@graphql/comment/comment';
import {
  useCreateAndAddClickUpTaskToInvoiceMutation,
  useCreateClickUpTaskMutation,
  useGetClickUpCustomFieldsQuery,
  useGetClickUpStatusesQuery,
  useUpdateClickUpTaskMutation
} from '@graphql/clickup_task/clickup';

const FormValidation = Yup.object({
  Notes: Yup.string(),
  'Date Sent': Yup.date().nullable(),
  'Invoice Payment Status': Yup.number(),
  'ISR#': Yup.string(),
  'Date Paid': Yup.date().nullable(),
  'Copy Total Here': Yup.number(),
  Rate: Yup.number(),
  'Fiscal Year': Yup.number(),
  'Contract Type': Yup.number(),
  Hours: Yup.number()
});

export type FormTextAreaProps = TextareaAutosizeProps & {
  name: string;
};

export const FormTextArea: FC<FormTextAreaProps> = (props) => {
  const { handleChange, handleBlur, values, isSubmitting } = useFormikContext<any>();
  return (
    <FormControl fullWidth>
      <StyledTextarea
        {...props}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values[props.name]}
        disabled={props.disabled || isSubmitting}
        sx={{ backgroundColor: 'grey.100' }}
      />
    </FormControl>
  );
};

export const Export = () => {
  const { data: clickUpCustomFields } = useGetClickUpCustomFieldsQuery();
  const { data: clickUpStatuses } = useGetClickUpStatusesQuery();
  const [createClickUpTask] = useCreateClickUpTaskMutation();
  const [addCommentMutation] = useAddCommentMutation();
  const [createAndAddClickUpTaskToInvoice] = useCreateAndAddClickUpTaskToInvoiceMutation();
  const [updateClickUpTask] = useUpdateClickUpTaskMutation();
  const location = useLocation();
  const state = location.state as any;
  const navigate = useNavigate();
  const [openBackDrop, setOpenBackDrop] = useState(false);

  const numberData = clickUpCustomFields?.getClickUpCustomFields.filter((field) => field.type === 'currency' || field.type === 'number');
  const dropDownData = clickUpCustomFields?.getClickUpCustomFields.filter((field) => field.type === 'drop_down');
  const textData = clickUpCustomFields?.getClickUpCustomFields.filter((field) => field.type === 'text');

  const combinedClickUpCustomFields = [...(numberData ?? []), ...(dropDownData ?? []), ...(textData ?? [])];

  const renderCustomField =
    combinedClickUpCustomFields.map((field) => {
      const commonProps = {
        label: field.name,
        key: field.id,
        name: field.name
      };

      switch (field.type) {
        case 'drop_down':
          return (
            <Box gridColumn="span 3" key={field.id}>
              <ObserverTextInput {...commonProps} select placeholder={field.name} fullWidth variant="outlined">
                {field.type_config.options?.map((option) => (
                  <MenuItem value={option.orderindex as number} key={option.id}>
                    {option.name}
                  </MenuItem>
                )) ?? []}
              </ObserverTextInput>
            </Box>
          );
        case 'text':
          return (
            <Box gridColumn="span 12" key={field.id}>
              <Typography>Notes</Typography>
              <FormTextArea name={field.name} minRows={8} />
            </Box>
          );
        case 'currency':
        case 'number':
          return (
            <Box gridColumn="span 3" key={field.id}>
              <ObserverTextInput {...commonProps} required={field.required || false} type="number" variant="outlined" fullWidth disabled />
            </Box>
          );
        default:
          return null;
      }
    }) ?? [];

  const initialValues = () => {
    const currentMonth = format(new Date(), 'MMM');
    const currentYear = format(new Date(), 'yyyy');
    const notes = state.notes.map((note: any) => `${format(new Date(note.createDate), 'dd MMM yyyy')} - ${note.content}`).join('\n');
    const description = state.rows.map((row: any) => `${row.employeeName} - ${row.billableHours} hours - $${row.amount}`).join('\n');

    return {
      title: `${currentMonth} 23 - ${state.projectName} - ${state.revisedBillableHour} hours - SAIL${currentYear}${format(new Date(), 'MM')}`,
      description: description,
      status: 'july (m1, q1)',
      Notes: notes,
      'Invoice Payment Status': 0,
      'Copy Total Here': state.revisedAmount,
      Rate: state.rate,
      'Fiscal Year': 0,
      'Contract Type': 0,
      Hours: state.revisedBillableHour
    };
  };

  const createComment = (type: string) => {
    let content: string;

    if (type === 'export') {
      content = `Exported to ClickUp on ${format(new Date(), 'dd MMM yyyy')}.`;
    } else {
      content = `Updated ClickUp Task on ${format(new Date(), 'dd MMM yyyy')}.`;
    }

    addCommentMutation({
      variables: {
        input: {
          content: content,
          invoiceId: state.invoiceId,
          deletable: false
        }
      }
    });
  };

  const createNewTaskToClickUp = (newTask: any) => {
    newTask.custom_fields.length > 0 &&
      createClickUpTask({
        variables: {
          task: newTask
        }
      }).then((res) => {
        if (res.data) {
          const task = { id: res.data.createClickUpTask?.id, url: res.data.createClickUpTask?.url };
          createComment('export');
          createTaskAndAddClickUpTaskToInvoice(task, state.invoiceId);
          navigate(-1);
        }
      });
  };

  const createTaskAndAddClickUpTaskToInvoice = (newTask: any, invoiceId: string) => {
    createAndAddClickUpTaskToInvoice({
      variables: {
        invoiceId: invoiceId,
        task: newTask
      }
    });
  };

  return (
    <Box sx={{ height: 'auto', margin: 'auto', paddingTop: 8 }}>
      <Typography variant="h6" sx={{ mb: 4 }}>
        Export to ClickUp
      </Typography>
      <StyledPaper>
        <Formik
          validationSchema={FormValidation}
          enableReinitialize={true}
          initialValues={initialValues()}
          onSubmit={(values) => {
            const { title, description, status, ...customFields } = values;

            const newTask = {
              name: title,
              description: description as string,
              status: status,
              custom_fields: [] as { id: string; value: any }[]
            };

            Object.keys(customFields).forEach((key) => {
              const customField = combinedClickUpCustomFields.find((field) => field.name === key);
              if (customField) {
                newTask.custom_fields.push({
                  id: customField.id,
                  value: customFields[key as keyof typeof customFields]
                });
              }
            });

            if (!state.taskId) {
              setOpenBackDrop(true);
              createNewTaskToClickUp(newTask);
              setOpenBackDrop(false);
            } else {
              setOpenBackDrop(true);
              updateClickUpTask({
                variables: {
                  task: {
                    ...newTask,
                    id: state.taskId
                  }
                }
              }).then((res) => {
                if (res?.data?.updateClickUpTask) {
                  createComment('update');
                  setOpenBackDrop(false);
                  navigate(-1);
                }
              });
            }
          }}
        >
          <Form>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openBackDrop}>
              <CircularProgress color="inherit" />
            </Backdrop>
            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={4} mb={5}>
              <Box gridColumn="span 6">
                <ObserverTextInput label="Title" name="title" type="text" fullWidth variant="outlined" />
              </Box>
              <Box gridColumn="span 6">
                <ObserverTextInput name="status" select label="Status" placeholder="Status" variant="outlined" fullWidth>
                  {clickUpStatuses?.getClickUpStatuses?.map((status) => {
                    return (
                      <MenuItem value={status.status} key={status.id}>
                        {status.status}
                      </MenuItem>
                    );
                  }) ?? []}
                </ObserverTextInput>
              </Box>
              <Box gridColumn="span 12">
                <Typography>Description</Typography>
                <FormTextArea name="description" minRows={5} />
              </Box>
            </Box>
            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={4}>
              {renderCustomField.map((item) => item)}
            </Box>
            <Stack direction="row" gap={2} justifyContent="end" marginTop={5}>
              <Button variant="contained" type="submit">
                {state.taskId ? 'Update' : 'Export'}
              </Button>
              <Button color="secondary" variant="outlined" onClick={() => navigate(-1)}>
                cancel
              </Button>
            </Stack>
          </Form>
        </Formik>
      </StyledPaper>
    </Box>
  );
};
