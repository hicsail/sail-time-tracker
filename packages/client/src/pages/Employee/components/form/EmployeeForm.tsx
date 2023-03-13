import * as Yup from 'yup';
import { FC } from 'react';
import { Form, Formik } from 'formik';
import { Container, Box, MenuItem } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import { useEmployeeCreateInputMutation } from '@graphql/employee/employee';
import { TextInput } from '@pages/Employee/components/form/TextInput';

const FormValidation = Yup.object({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email address').required('Required'),
  rate: Yup.number().required('Required').min(0, 'Rate should be greater than 0'),
  status: Yup.string().required('Required')
});

interface AddEmployeeFormProps {
  type: 'add' | 'edit';
}

export const EmployeeForm: FC<AddEmployeeFormProps> = ({ type }) => {
  const [addEmployee, { data, loading, error }] = useEmployeeCreateInputMutation();

  return (
    <Formik
      validateOnChange={true}
      validateOnBlur={true}
      initialValues={{ name: 'test', email: 'test@test.com', rate: '22', status: '1' }}
      validationSchema={FormValidation}
      onSubmit={async (values) => {
        await addEmployee({
          variables: {
            newEmployee: { ...values, rate: parseFloat(values.rate) }
          }
        });
      }}
    >
      <Form>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && <Container>`Submission error! ${error.message}`</Container>}
          <TextInput id="name" type="text" name="name" placeholder="Name" required />
          <TextInput id="email" type="email" name="email" placeholder="Email" required />
          <TextInput id="rate" type="number" name="rate" placeholder="Rate" InputProps={{ inputProps: { min: 0 } }} required />
          <TextInput name="status" select placeholder="Status">
            <MenuItem value={0}>Inactive</MenuItem>
            <MenuItem value={1}>Active</MenuItem>
          </TextInput>
          <LoadingButton color="primary" variant="contained" loadingPosition="start" startIcon={<SendIcon />} fullWidth type="submit" loading={loading}>
            Submit
          </LoadingButton>
        </Box>
      </Form>
    </Formik>
  );
};
