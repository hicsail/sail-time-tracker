import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Box, MenuItem, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { GetEmployeeListDocument, useEmployeeCreateInputMutation, useEmployeeUpdateInputMutation, useGetEmployeeByIdLazyQuery } from '@graphql/employee/employee';
import { ObserverTextInput } from '@components/form/ObserverTextInput';
import { useParams } from 'react-router-dom';
import { FC, useEffect, useState } from 'react';
import { DefaultContainedButton } from '@components/StyledComponent';
import { useSnackBar } from '@context/snackbar.context';

const FormValidation = Yup.object({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email address').required('Required'),
  status: Yup.string().required('Required')
});

interface EmployeeFormProps {
  handleClose: () => void;
}
export const EmployeeForm: FC<EmployeeFormProps> = ({ handleClose }) => {
  const [initialValue, setInitialValue] = useState({ name: '', email: '', status: '' });
  const { id } = useParams();
  const [updateEmployee] = useEmployeeUpdateInputMutation();
  const [addEmployee] = useEmployeeCreateInputMutation();
  const [getEmployeeById] = useGetEmployeeByIdLazyQuery();
  const { toggleSnackBar } = useSnackBar();

  useEffect(() => {
    id &&
      getEmployeeById({
        variables: {
          id: id
        }
      }).then((res) => {
        if (res.data) {
          const { name, email, status } = res.data.employee;
          setInitialValue({
            name,
            email,
            status: status as string
          });
        }
      });
  }, [id]);

  return (
    <>
      <Typography variant="h5">{id ? 'Edit' : 'Create a new employee'}</Typography>
      <Formik
        validateOnChange={true}
        initialValues={initialValue}
        validationSchema={FormValidation}
        enableReinitialize={true}
        onSubmit={async (values) => {
          // if no id, create employee
          if (!id) {
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
                updateEmployee: { ...values, id: id }
              }
            });

            res.data?.updateEmployee && toggleSnackBar('Successfully update the employee!', { variant: 'success' });
          }
          return handleClose();
        }}
      >
        <Form>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
            <ObserverTextInput id="name" type="text" name="name" label="Name" placeholder="Name" />
            <ObserverTextInput id="email" type="email" name="email" label="Email" placeholder="Email" />
            <ObserverTextInput id="status" select name="status" label="Status" placeholder="Status">
              <MenuItem value="Inactive">Inactive</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
            </ObserverTextInput>
            <DefaultContainedButton variant="contained" startIcon={<SendIcon />} fullWidth type="submit">
              {id ? 'Update' : 'Create'}
            </DefaultContainedButton>
          </Box>
        </Form>
      </Formik>
    </>
  );
};
