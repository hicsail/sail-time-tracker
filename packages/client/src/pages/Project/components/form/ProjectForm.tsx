import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Container, Box, MenuItem } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import { useGetProjectByIdQuery, useProjectCreateInputMutation } from '@graphql/project/project';
import { TextInput } from '@components/form/TextInput';
import { useNavigate, useParams } from 'react-router-dom';
import { Paths } from '@constants/paths';
import { useEffect, useState } from 'react';

const FormValidation = Yup.object({
  name: Yup.string().required('Required'),
  description: Yup.string(),
  status: Yup.string().required('Required')
});

export const ProjectForm = () => {
  const [addProject, { loading, error }] = useProjectCreateInputMutation();
  const [initialValue, setInitialValue] = useState({ name: '', description: '', status: '' });
  let { id } = useParams();
  const navigate = useNavigate();

  const { data } = useGetProjectByIdQuery({
    variables: {
      id: id as string
    }
  });

  useEffect(() => {
    data &&
      setInitialValue({
        name: data?.project.name,
        description: data?.project.description,
        status: data?.project.status ? data.project.status : ''
      });
  }, [data]);

  return (
    <Formik
      validateOnChange={true}
      initialValues={initialValue}
      validationSchema={FormValidation}
      enableReinitialize={true}
      onSubmit={async (values) => {
        if (!id) {
          await addProject({
            variables: {
              newProject: { ...values, status: values.status.toString() }
            }
          });
          return await navigate(Paths.PROJECT_lIST);
        }
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
