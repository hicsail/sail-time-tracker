import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Box, MenuItem } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import { GetProjectListDocument, useGetProjectByIdQuery, useProjectCreateInputMutation, useProjectUpdateInputMutation } from '@graphql/project/project';
import { TextInput } from '@components/form/TextInput';
import { useParams } from 'react-router-dom';
import { FC, useEffect, useState } from 'react';

const FormValidation = Yup.object({
  name: Yup.string().required('Required'),
  description: Yup.string(),
  status: Yup.string().required('Required'),
  isBillable: Yup.string().required('Required')
});

interface ProjectFormProps {
  handleClose: () => void;
}

export const ProjectForm: FC<ProjectFormProps> = ({ handleClose }) => {
  const [addProject] = useProjectCreateInputMutation();
  const [updateProject] = useProjectUpdateInputMutation();
  const [initialValue, setInitialValue] = useState({ name: '', description: '', status: '', isBillable: '' });
  let { id } = useParams();

  const { data } = useGetProjectByIdQuery({
    variables: {
      id: id as string
    },
    nextFetchPolicy: 'cache-and-network'
  });

  useEffect(() => {
    data &&
      setInitialValue({
        name: data?.project.name,
        description: data?.project.description,
        status: data?.project.status ? data.project.status : '',
        isBillable: data?.project.isBillable.toString()
      });
  }, [data]);

  return (
    <Formik
      validateOnChange={true}
      initialValues={initialValue}
      validationSchema={FormValidation}
      enableReinitialize={true}
      onSubmit={async (values) => {
        // if no id, create project
        if (!id) {
          // after submitting the new project re-fetch the project via graphql
          await addProject({
            variables: {
              newProject: { ...values, status: values.status.toString(), isBillable: values.isBillable == 'true' }
            },
            refetchQueries: [{ query: GetProjectListDocument }]
          });
          return handleClose();
        } else {
          // after updating the project, re-fetch the projects via graphql
          await updateProject({
            variables: {
              updateProject: { ...values, status: values.status.toString(), id: id, isBillable: values.isBillable == 'true' }
            }
          });
        }

        return handleClose();
      }}
    >
      <Form>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          <TextInput id="name" type="text" name="name" label="Name" placeholder="Name" required />
          <TextInput id="description" type="text" name="description" label="Description" placeholder="Description" required />
          <TextInput name="status" select label="Status" placeholder="Status">
            <MenuItem value="Inactive">Inactive</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
          </TextInput>
          <TextInput name="isBillable" select label="isBillable" placeholder="IsBillable">
            <MenuItem value="true">True</MenuItem>
            <MenuItem value="false">False</MenuItem>
          </TextInput>
          <LoadingButton color="primary" variant="contained" loadingPosition="start" startIcon={<SendIcon />} fullWidth type="submit">
            Submit
          </LoadingButton>
        </Box>
      </Form>
    </Formik>
  );
};
