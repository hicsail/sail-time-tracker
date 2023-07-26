import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Box, MenuItem, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { GetProjectByIdDocument, GetProjectListDocument, useGetProjectByIdLazyQuery, useProjectCreateInputMutation, useProjectUpdateInputMutation } from '@graphql/project/project';
import { ObserverTextInput } from '@components/form/ObserverTextInput';
import { useParams } from 'react-router-dom';
import { FC, useEffect, useState } from 'react';
import { DefaultContainedButton } from '@components/StyledComponent';

const FormValidation = Yup.object({
  name: Yup.string().required('Required'),
  description: Yup.string(),
  rate: Yup.string().required('Required'),
  fte: Yup.string().required('Required'),
  status: Yup.string().required('Required'),
  isBillable: Yup.string().required('Required'),
  contractTypeId: Yup.number().required('Required')
});

interface ProjectFormProps {
  handleClose: () => void;
}

export const ProjectForm: FC<ProjectFormProps> = ({ handleClose }) => {
  const [addProject] = useProjectCreateInputMutation();
  const [updateProject] = useProjectUpdateInputMutation();
  const [initialValue, setInitialValue] = useState<{ name: string; description: string; rate: string; status: string; isBillable: string; fte: string; contractTypeId: number }>({
    name: '',
    description: '',
    rate: '',
    status: '',
    fte: '',
    isBillable: '',
    contractTypeId: 0
  });

  const { id } = useParams();

  const [getProjectById] = useGetProjectByIdLazyQuery();

  useEffect(() => {
    id &&
      getProjectById({
        variables: {
          id: id as string
        },
        nextFetchPolicy: 'cache-and-network'
      }).then((res) => {
        if (res && res.data) {
          const { name, description, status, isBillable, rate, fte, contractType } = res.data.project;
          setInitialValue({
            name,
            description,
            status,
            isBillable: isBillable.toString(),
            rate: rate.toString(),
            fte: fte.toString(),
            contractTypeId: contractType.id
          });
        }
      });
  }, [id, open]);

  return (
    <>
      <Typography variant="h5">{id ? 'Edit' : 'Create a new project'}</Typography>
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
                newProject: {
                  ...values,
                  status: values.status.toString(),
                  isBillable: values.isBillable == 'true',
                  rate: parseFloat(values.rate),
                  fte: parseFloat(values.fte),
                  contractTypeId: values.contractTypeId
                }
              },
              refetchQueries: [{ query: GetProjectListDocument }]
            });
            return handleClose();
          } else {
            // after updating the project, re-fetch the projects via graphql
            await updateProject({
              variables: {
                updateProject: {
                  ...values,
                  status: values.status.toString(),
                  id: id,
                  isBillable: values.isBillable == 'true',
                  rate: parseFloat(values.rate),
                  fte: parseFloat(values.fte),
                  contractTypeId: values.contractTypeId
                }
              },
              refetchQueries: [
                {
                  query: GetProjectByIdDocument,
                  variables: {
                    id: id as string
                  }
                },
                {
                  query: GetProjectListDocument
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
            <ObserverTextInput id="description" type="text" name="description" label="Description" placeholder="Description" required />
            <ObserverTextInput id="rate" type="number" name="rate" label="Rate" placeholder="Rate" required />
            <ObserverTextInput id="fte" type="number" name="fte" label="FTE" placeholder="FTE" required />
            <ObserverTextInput name="status" select label="Status" placeholder="Status" required>
              <MenuItem value="Inactive">Inactive</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
            </ObserverTextInput>
            <ObserverTextInput name="isBillable" select label="isBillable" placeholder="IsBillable" required>
              <MenuItem value="true">True</MenuItem>
              <MenuItem value="false">False</MenuItem>
            </ObserverTextInput>
            <ObserverTextInput name="contractTypeId" select label="Contract Type" placeholder="Contract Type" required>
              <MenuItem value={0}>Internal</MenuItem>
              <MenuItem value={1}>External</MenuItem>
              <MenuItem value={2}>Grant Fund</MenuItem>
            </ObserverTextInput>
            <DefaultContainedButton color="primary" variant="contained" startIcon={<SendIcon />} fullWidth type="submit">
              {id ? 'Update' : 'Create'}
            </DefaultContainedButton>
          </Box>
        </Form>
      </Formik>
    </>
  );
};
