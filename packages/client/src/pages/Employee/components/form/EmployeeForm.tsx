import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Box, MenuItem, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { GetEmployeeListDocument, useEmployeeCreateInputMutation, useEmployeeUpdateInputMutation } from '@graphql/employee/employee';
import { ObserverTextInput } from '@components/form/ObserverTextInput';
import { useEffect, useState } from 'react';
import { DefaultContainedButton } from '@components/StyledComponent';
import { useSnackBar } from '@context/snackbar.context';

const FormValidation = Yup.object({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email address').required('Required'),
  status: Yup.string().required('Required')
});

interface EmployeeFormProps {
  handleClose: () => void;
  targetEmployee?: any;
}
export const EmployeeForm = ({ handleClose, targetEmployee }: EmployeeFormProps) => {
  console.log(targetEmployee);
  const [initialValue, setInitialValue] = useState({ name: '', email: '', status: '' });
  const [updateEmployee] = useEmployeeUpdateInputMutation();
  const [addEmployee, { error }] = useEmployeeCreateInputMutation();
  const { toggleSnackBar } = useSnackBar();

  useEffect(() => {
    if (targetEmployee) {
      const { name, email, status } = targetEmployee;
      setInitialValue({
        name,
        email,
        status: status as string
      });
    }
  }, [targetEmployee]);

  return (
    <>
      <Typography variant="h5">{targetEmployee ? 'Edit' : 'Create a new employee'}</Typography>
      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={initialValue}
        validationSchema={FormValidation}
        enableReinitialize={true}
        onSubmit={async (values) => {
          // if no id, create employee
          if (!targetEmployee) {
            // after submitting the new employee re-fetch the employees via graphql
            const res = await addEmployee({
              variables: {
                newEmployee: { ...values }
              },
              refetchQueries: [{ query: GetEmployeeListDocument }]
            });
            res.data?.addEmployee && toggleSnackBar('Successfully created a new employee!', { variant: 'success' });
          } else {
            const res = await updateEmployee({
              variables: {
                updateEmployee: { ...values, id: targetEmployee.id }
              }
            });

            res.data?.updateEmployee && toggleSnackBar('Successfully update the employee!', { variant: 'success' });
          }
          return handleClose();
        }}
      >
        <Form>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
            <ObserverTextInput id="name" type="text" name="name" label="Name" placeholder="Name" variant="outlined" />
            <ObserverTextInput id="email" type="email" name="email" label="Email" placeholder="Email" variant="outlined" />
            <ObserverTextInput id="status" select name="status" label="Status" placeholder="Status" variant="outlined">
              <MenuItem value="Inactive">Inactive</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
            </ObserverTextInput>
            <DefaultContainedButton variant="contained" startIcon={<SendIcon />} fullWidth type="submit">
              {targetEmployee ? 'Update' : 'Create'}
            </DefaultContainedButton>
          </Box>
        </Form>
      </Formik>
      {error && toggleSnackBar('There are something wrong!', { variant: 'error' })}
    </>
  );
};
