import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { useGetClickUpCustomFieldsQuery } from '@graphql/invoice/invoice';
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
  const shortTextData = data?.getClickUpCustomFields.filter((field) => field.type === 'short_text');
  const dateData = data?.getClickUpCustomFields.filter((field) => field.type === 'date');
  const numberData = data?.getClickUpCustomFields.filter((field) => field.type === 'currency' || field.type === 'number');
  const dropDownData = data?.getClickUpCustomFields.filter((field) => field.type === 'drop_down');
  const textData = data?.getClickUpCustomFields.filter((field) => field.type === 'text');

  const combinedData = [...(shortTextData ?? []), ...(numberData ?? []), ...(dropDownData ?? []), ...(dateData ?? []), ...(textData ?? [])];

  const renderCustomField =
    combinedData.map((field) => {
      const commonProps = {
        label: field.name,
        key: field.id,
        name: field.name
      };

      switch (field.type) {
        case 'date':
          return (
            <Box gridColumn="span 2">
              <DatePicker
                {...commonProps}
                value={null}
                onChange={() => {}}
                slotProps={{
                  textField: {
                    id: field.id,
                    name: field.name
                  }
                }}
              />
            </Box>
          );
        case 'short_text':
          return (
            <Box gridColumn="span 4">
              <ObserverTextInput {...commonProps} required={field.required || false} type={field.type} />
            </Box>
          );
        case 'drop_down':
          const defaultValue = field.type_config.options?.find((option) => option.orderindex === 0)?.id ?? '';
          return (
            <Box gridColumn="span 4">
              <FormControl fullWidth key={field.id}>
                <InputLabel id="demo-simple-select-label">{field.name}</InputLabel>
                <Select labelId="demo-simple-select-label" value={defaultValue} label={field.name}>
                  {field.type_config.options?.map((option) => (
                    <MenuItem value={option.id} key={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          );
        case 'text':
          return (
            <Box {...commonProps} gridColumn="span 10">
              <Typography>Notes</Typography>
              <StyledTextarea minRows={5} />
            </Box>
          );
        case 'currency':
        case 'number':
          return (
            <Box gridColumn="span 4">
              <ObserverTextInput {...commonProps} required={field.required || false} type="number" />
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
          <Box display="grid" gridTemplateColumns="repeat(10, 1fr)" gap={4}>
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
