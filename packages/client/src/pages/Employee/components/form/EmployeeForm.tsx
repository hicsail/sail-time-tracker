import * as Yup from 'yup';
import { FC } from 'react';
import { useFormik } from 'formik';
import { TextField, Container, Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import { useEmployeeCreateInputMutation } from '@graphql/employee/employee';

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

  const formik = useFormik({
    initialValues: { name: 'xinyue', email: 'xinyue@xinyue.com', rate: '22', status: 'P' },
    validationSchema: FormValidation,
    onSubmit: async (values, { resetForm }) => {
      await addEmployee({
        variables: {
          newEmployee: { ...values, rate: parseFloat(values.rate) }
        }
      });
      // clean the form values
      resetForm();
    }
  });

  if (error) return <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>`Submission error! ${error.message}`</Container>;

  return (
    <Container>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextField id="name" name="name" type="text" placeholder="Employee Name" value={formik.values.name} onChange={formik.handleChange} required />
          <TextField
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            required
          />
          <TextField
            id="rate"
            name="rate"
            type="number"
            placeholder="Rate"
            value={formik.values.rate}
            onChange={formik.handleChange}
            error={formik.touched.rate && Boolean(formik.errors.rate)}
            InputProps={{ inputProps: { min: 0 } }}
            helperText={formik.touched.rate && formik.errors.rate}
            required
          />
          <TextField id="status" name="status" type="text" placeholder="Status" value={formik.values.status} onChange={formik.handleChange} required />
          <LoadingButton color="primary" variant="contained" loadingPosition="start" startIcon={<SendIcon />} fullWidth type="submit" loading={loading}>
            Submit
          </LoadingButton>
        </Box>
      </form>
    </Container>
  );
};
