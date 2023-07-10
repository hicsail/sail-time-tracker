import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, styled, TextareaAutosizeProps, Typography } from '@mui/material';
import { useGetClickUpCustomFieldsQuery, useGetClickUpStatusesQuery } from '@graphql/invoice/invoice';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';
import { StyledTextarea } from '@components/StyledComponent';
import { ObserverTextInput } from '@components/form/ObserverTextInput';
import { Field, Form, Formik, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { StyledPaper } from '@components/StyledPaper';
import { FC } from 'react';

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

const FormTextArea: FC<FormTextAreaProps> = (props) => {
  const { handleChange, handleBlur, values, touched, errors, isSubmitting } = useFormikContext<any>();
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

export type FormDatePickerProps = DatePickerProps<any> & {
  name: string;
  label: string;
  disabled?: boolean;
};

const FormDatePicker: FC<FormDatePickerProps> = (props) => {
  const { handleChange, handleBlur, values, touched, errors, isSubmitting, setFieldValue } = useFormikContext<any>();
  return (
    <FormControl fullWidth>
      <DatePicker
        onChange={(date) => setFieldValue(props.name, date)}
        value={values[props.name]}
        disabled={props.disabled || isSubmitting}
        slotProps={{
          textField: {
            label: props.label,
            name: props.name,
            fullWidth: true,
            sx: {
              backgroundColor: 'grey.100',
              '& fieldset': {
                borderColor: 'grey.300'
              }
            }
          }
        }}
      />
    </FormControl>
  );
};

export const Export = () => {
  const { data: clickUpCustomFields } = useGetClickUpCustomFieldsQuery();
  const { data: clickUpStatuses } = useGetClickUpStatusesQuery();
  const shortTextData = clickUpCustomFields?.getClickUpCustomFields.filter((field) => field.type === 'short_text');
  const dateData = clickUpCustomFields?.getClickUpCustomFields.filter((field) => field.type === 'date');
  const numberData = clickUpCustomFields?.getClickUpCustomFields.filter((field) => field.type === 'currency' || field.type === 'number');
  const dropDownData = clickUpCustomFields?.getClickUpCustomFields.filter((field) => field.type === 'drop_down');
  const textData = clickUpCustomFields?.getClickUpCustomFields.filter((field) => field.type === 'text');

  const combinedClickUpCustomFields = [...(shortTextData ?? []), ...(numberData ?? []), ...(dateData ?? []), ...(dropDownData ?? []), ...(textData ?? [])];

  const renderCustomField =
    combinedClickUpCustomFields.map((field) => {
      const commonProps = {
        label: field.name,
        key: field.id,
        name: field.name
      };

      switch (field.type) {
        case 'date':
          return (
            <Box gridColumn="span 3" key={field.id}>
              <FormDatePicker name={field.name} label={field.name} />
            </Box>
          );
        case 'short_text':
          return (
            <Box gridColumn="span 3" key={field.id}>
              <ObserverTextInput {...commonProps} required={field.required || false} type={field.type} fullWidth variant="outlined" />
            </Box>
          );
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
              <FormTextArea name={field.name} minRows={5} />
            </Box>
          );
        case 'currency':
        case 'number':
          return (
            <Box gridColumn="span 3" key={field.id}>
              <ObserverTextInput {...commonProps} required={field.required || false} type="number" variant="outlined" fullWidth />
            </Box>
          );
        default:
          return null;
      }
    }) ?? [];

  return (
    <Box sx={{ height: 'auto', margin: 'auto', paddingTop: 8 }}>
      <Typography variant="h6" sx={{ mb: 4 }}>
        Export to ClickUp
      </Typography>
      <StyledPaper>
        <Formik
          validationSchema={FormValidation}
          enableReinitialize={true}
          onSubmit={(values) => console.log(values)}
          initialValues={{
            title: '',
            description: '',
            status: '',
            Notes: '',
            'Date Sent': null,
            'Invoice Payment Status': 0,
            'ISR#': '',
            'Date Paid': null,
            'Copy Total Here': '',
            Rate: '',
            'Fiscal Year': 0,
            'Contract Type': 0,
            Hours: ''
          }}
        >
          <Form>
            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={4} mb={5}>
              <Box gridColumn="span 6">
                <ObserverTextInput label="Title" name="title" type="text" fullWidth variant="outlined" />
              </Box>
              <Box gridColumn="span 6">
                <ObserverTextInput name="status" select label="Status" placeholder="Status" variant="outlined" fullWidth>
                  {clickUpStatuses?.getClickUpStatuses?.map((status) => {
                    return (
                      <MenuItem value={status.orderindex} key={status.id}>
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
                Export
              </Button>
              <Button color="secondary" variant="outlined">
                cancel
              </Button>
            </Stack>
          </Form>
        </Formik>
      </StyledPaper>
    </Box>
  );
};
