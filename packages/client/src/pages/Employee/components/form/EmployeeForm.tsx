import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Box, MenuItem } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import { GetEmployeeListDocument, useEmployeeCreateInputMutation, useEmployeeUpdateInputMutation, useGetEmployeeByIdQuery } from '@graphql/employee/employee';
import { TextInput } from '@components/form/TextInput';
import { useParams } from 'react-router-dom';
import { FC, useEffect, useState } from 'react';

const FormValidation = Yup.object({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email address').required('Required'),
  rate: Yup.number().required('Required').min(0, 'Rate should be greater than 0'),
  status: Yup.string().required('Required')
});

interface EmployeeFormProps {
  handleClose: () => void;
}

export const EmployeeForm: FC<EmployeeFormProps> = ({ handleClose }) => {
  const [initialValue, setInitialValue] = useState({ name: '', email: '', rate: '', status: '' });
  let { id } = useParams();
  const [updateEmployee] = useEmployeeUpdateInputMutation();
  const [addEmployee] = useEmployeeCreateInputMutation();

  const { data } = useGetEmployeeByIdQuery({
    variables: {
      id: id as string
    },
    nextFetchPolicy: 'cache-and-network'
  });

  useEffect(() => {
    data &&
      setInitialValue({
        name: data?.employee.name,
        email: data?.employee.email,
        rate: data?.employee.rate.toString(),
        status: data?.employee.status ? data.employee.status : ''
      });
  }, [data]);

  return (
    <Formik
      validateOnChange={true}
      initialValues={initialValue}
      validationSchema={FormValidation}
      enableReinitialize={true}
      onSubmit={async (values) => {
        // if no id, create employee
        if (!id) {
          // after submitting the new employee re-fetch the employees via graphql
          await addEmployee({
            variables: {
              newEmployee: { ...values, rate: parseFloat(values.rate), status: values.status.toString() }
            },
            refetchQueries: [{ query: GetEmployeeListDocument }]
          });
        } else {
          // after updating the employee, re-fetch the employees via graphql
          await updateEmployee({
            variables: {
              updateEmployee: { ...values, rate: parseFloat(values.rate), status: values.status.toString(), id: id }
            }
          });
        }
        return handleClose();
      }}
    >
      <Form>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          <TextInput id="name" type="text" name="name" label="Name" placeholder="Name" required />
          <TextInput id="email" type="email" name="email" label="Email" placeholder="Email" required />
          <TextInput id="rate" type="number" name="rate" label="Rate" placeholder="Rate" InputProps={{ inputProps: { min: 0 } }} required />
          <TextInput name="status" select label="Status" placeholder="Status">
            <MenuItem value="Inactive">Inactive</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
          </TextInput>
          <LoadingButton color="primary" variant="contained" loadingPosition="start" startIcon={<SendIcon />} fullWidth type="submit">
            Submit
          </LoadingButton>
        </Box>
      </Form>
    </Formik>
  );
};
