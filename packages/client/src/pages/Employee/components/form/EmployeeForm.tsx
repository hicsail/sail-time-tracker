import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Box, MenuItem, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import {
  GetEmployeeByIdDocument,
  GetEmployeeListDocument,
  useEmployeeCreateInputMutation,
  useEmployeeUpdateInputMutation,
  useGetEmployeeByIdLazyQuery
} from '@graphql/employee/employee';
import { ObserverTextInput } from '@components/form/ObserverTextInput';
import { useParams } from 'react-router-dom';
import { FC, useEffect, useState } from 'react';
import { DefaultContainedButton } from '@components/StyledComponent';

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

  useEffect(() => {
    id &&
      getEmployeeById({
        variables: {
          id: id as string
        },
        nextFetchPolicy: 'cache-and-network'
      }).then((res) => {
        if (res && res.data) {
          const { name, email, status } = res.data.employee;
          setInitialValue({
            name,
            email,
            status: status as string
          });
        }
      });
  }, [id, open]);

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
            await addEmployee({
              variables: {
                newEmployee: { ...values, status: values.status.toString() }
              },
              refetchQueries: [{ query: GetEmployeeListDocument }]
            });
          } else {
            // after updating the employee, re-fetch the employees via graphql
            await updateEmployee({
              variables: {
                updateEmployee: { ...values, status: values.status.toString(), id: id }
              },
              refetchQueries: [
                {
                  query: GetEmployeeByIdDocument,
                  variables: {
                    id: id as string
                  }
                }
              ]
            });
          }
          return handleClose();
        }}
      >
        <Form>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
            <ObserverTextInput id="name" type="text" name="name" label="Name" placeholder="Name" required />
            <ObserverTextInput id="email" type="email" name="email" label="Email" placeholder="Email" required />
            <ObserverTextInput name="status" select label="Status" placeholder="Status">
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
