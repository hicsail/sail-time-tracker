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

  console.log(data?.getClickUpCustomFields);
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
          );
        case 'short_text':
          return <ObserverTextInput {...commonProps} required={field.required || false} type={field.type} />;
        case 'drop_down':
          const defaultValue = field.type_config.options?.find((option) => option.orderindex === 0)?.id ?? '';
          return (
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
          );
        case 'text':
          return (
            <Box {...commonProps}>
              <Typography>Notes</Typography>
              <StyledTextarea minRows={5} />
            </Box>
          );
        case 'currency':
        case 'number':
          return <ObserverTextInput {...commonProps} required={field.required || false} type="number" />;
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
          <Stack gap="1rem">
            {renderCustomField.map((item) => (
              <Box key={item?.key}>{item}</Box>
            ))}
          </Stack>
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
