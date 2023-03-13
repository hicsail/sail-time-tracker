import * as Yup from 'yup';
import { FC } from 'react';
import { Form, Formik } from 'formik';
import { Container, Box, MenuItem } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import { useProjectCreateInputMutation } from '@graphql/project/project';
import { TextInput } from '@components/form/TextInput';

const FormValidation = Yup.object({
  name: Yup.string().required('Required'),
  description: Yup.string(),
  status: Yup.string().required('Required')
});

interface AddProjectFormProps {
  type: 'add' | 'edit';
}

export const ProjectForm: FC<AddProjectFormProps> = ({ type }) => {
  const [addProject, { data, loading, error }] = useProjectCreateInputMutation();

  return (
    <Formik
      validateOnChange={true}
      initialValues={{ name: 'project 1', description: 'this is a description for project 1', status: 'Active' }}
      validationSchema={FormValidation}
      onSubmit={async (values) => {
        await addProject({
          variables: {
            newProject: { ...values, status: values.status.toString() }
          }
        });
      }}
    >
      <Form>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && <Container>`Submission error! ${error.message}`</Container>}
          <TextInput id="name" type="text" name="name" label="Name" placeholder="Name" required />
          <TextInput id="description" type="text" name="description" label="Description" placeholder="Description" required />
          <TextInput name="status" select label="Status" placeholder="Status">
            <MenuItem value="Inactive">Inactive</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
          </TextInput>
          <LoadingButton color="primary" variant="contained" loadingPosition="start" startIcon={<SendIcon />} fullWidth type="submit" loading={loading}>
            Submit
          </LoadingButton>
        </Box>
      </Form>
    </Formik>
  );
};
