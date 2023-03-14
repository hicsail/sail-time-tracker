import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Container, Box, MenuItem } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import { GetEmployeeListDocument, useEmployeeCreateInputMutation } from '@graphql/employee/employee';
import { TextInput } from '@components/form/TextInput';
import { useNavigate, useParams } from 'react-router-dom';
import { Paths } from '@constants/paths';

const FormValidation = Yup.object({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email address').required('Required'),
  rate: Yup.number().required('Required').min(0, 'Rate should be greater than 0'),
  status: Yup.string().required('Required')
});

export const EmployeeForm = () => {
  const [addEmployee, { data, loading, error }] = useEmployeeCreateInputMutation();
  const navigate = useNavigate();
  let { id } = useParams();

  console.log(id);
  return (
    <Formik
      validateOnChange={true}
      initialValues={!id ? { name: '', email: '', rate: '', status: '1' } : { name: 'test', email: 'test@test.com', rate: '22', status: '1' }}
      validationSchema={FormValidation}
      onSubmit={async (values) => {
        // after submitting the new employee re-fetch the employees via graphql
        await addEmployee({
          variables: {
            newEmployee: { ...values, rate: parseFloat(values.rate), status: values.status.toString() }
          },
          refetchQueries: [{ query: GetEmployeeListDocument }]
        });
        await navigate(Paths.EMPLOYEE_lIST);
      }}
    >
      <Form>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && <Container>`Submission error! ${error.message}`</Container>}
          <TextInput id="name" type="text" name="name" label="Name" placeholder="Name" required />
          <TextInput id="email" type="email" name="email" label="Email" placeholder="Email" required />
          <TextInput id="rate" type="number" name="rate" label="Rate" placeholder="Rate" InputProps={{ inputProps: { min: 0 } }} required />
          <TextInput name="status" select label="Status" placeholder="Status">
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
