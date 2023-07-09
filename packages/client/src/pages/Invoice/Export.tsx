import React, { useEffect } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { GetAllInvoicesDocument, SearchInvoiceDocument, useGetClickUpCustomFieldsQuery } from '@graphql/invoice/invoice';
import { DatePicker } from '@mui/x-date-pickers';
import { StyledTextarea } from '@components/StyledComponent';
import { ObserverTextInput } from '@components/form/ObserverTextInput';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

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

export const Export = () => {
  const { data } = useGetClickUpCustomFieldsQuery();

  console.log(data?.getClickUpCustomFields);
  const shortTextData = data?.getClickUpCustomFields.filter((field) => field.type === 'short_text');
  const dateData = data?.getClickUpCustomFields.filter((field) => field.type === 'date');
  const numberData = data?.getClickUpCustomFields.filter((field) => field.type === 'currency' || field.type === 'number');
  const dropDownData = data?.getClickUpCustomFields.filter((field) => field.type === 'drop_down');
  const textData = data?.getClickUpCustomFields.filter((field) => field.type === 'text');

  const combinedData = [...(shortTextData ?? []), ...(numberData ?? []), ...(dropDownData ?? []), ...(dateData ?? []), ...(textData ?? [])];

  const renderCustomField = combinedData?.map((field) => {
    if (field.type === 'date') {
      return (
        <DatePicker
          label={field.name}
          value={null}
          onChange={() => {}}
          key={field.id}
          slotProps={{
            textField: {
              id: field.id,
              name: field.name
            }
          }}
        />
      );
    } else if (field.type === 'short_text') {
      return <ObserverTextInput label={field.name} required={field.required || false} key={field.id} type={field.type} name={field.name} />;
    } else if (field.type === 'drop_down') {
      return (
        <FormControl fullWidth key={field.id}>
          <InputLabel id="demo-simple-select-label">{field.name}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={field.type_config.options?.find((option) => option.orderindex === 0)?.id || ''}
            label={field.name}
            name={field.name}
          >
            {field.type_config.options?.map((option) => {
              return (
                <MenuItem value={option.id} key={option.id}>
                  {option.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      );
    } else if (field.type === 'text') {
      return (
        <Box key={field.id}>
          <Typography>Notes</Typography>
          <StyledTextarea minRows={5} />
        </Box>
      );
    } else if (field.type === 'currency' || field.type === 'number') {
      return <ObserverTextInput label={field.name} required={field.required || false} key={field.id} type="number" name={field.name} />;
    }
  });

  return (
    <Box sx={{ height: 'auto', margin: 'auto', paddingTop: 8 }}>
      <Typography variant="h6" sx={{ mb: 4 }}>
        Export to ClickUp
      </Typography>
      <Formik
        validationSchema={FormValidation}
        enableReinitialize={true}
        onSubmit={(values) => console.log(values)}
        initialValues={{
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
          <Stack gap="1rem">{renderCustomField}</Stack>
          <Button variant="contained" sx={{ width: '100%', marginTop: 3 }} type="submit">
            Export
          </Button>
        </Form>
      </Formik>

      {/*<Stack direction="row" gap={2} justifyContent="end">*/}
      {/*  <Button color="error" variant="contained">*/}
      {/*    export*/}
      {/*  </Button>*/}
      {/*  <Button color="secondary" variant="outlined">*/}
      {/*    cancel*/}
      {/*  </Button>*/}
      {/*</Stack>*/}
    </Box>
  );
};
