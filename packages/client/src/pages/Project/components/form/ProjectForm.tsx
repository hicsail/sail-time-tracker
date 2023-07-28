import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Grid, MenuItem, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { GetProjectListDocument, useGetProjectByIdLazyQuery, useProjectCreateInputMutation, useProjectUpdateInputMutation } from '@graphql/project/project';
import { ObserverTextInput } from '@components/form/ObserverTextInput';
import { useParams } from 'react-router-dom';
import { FC, useEffect, useState } from 'react';
import { DefaultContainedButton } from '@components/StyledComponent';
import { useSnackBar } from '@context/snackbar.context';

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
  const [getProjectById] = useGetProjectByIdLazyQuery();
  const { toggleSnackBar } = useSnackBar();
  const { id } = useParams();
  const [initialValue, setInitialValue] = useState<{ name: string; description: string; rate: string; status: string; isBillable: string; fte: string; contractTypeId: number }>({
    name: '',
    description: '',
    rate: '',
    status: '',
    fte: '',
    isBillable: '',
    contractTypeId: 0
  });

  useEffect(() => {
    id &&
      getProjectById({
        variables: {
          id: id
        }
      }).then((res) => {
        if (res.data) {
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
  }, [id]);

  return (
    <>
      <Typography variant="h5">{id ? 'Edit' : 'Create a new project'}</Typography>
      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={initialValue}
        validationSchema={FormValidation}
        enableReinitialize={true}
        onSubmit={async (values) => {
          // if no id, create project
          if (!id) {
            // after submitting the new project re-fetch the project via graphql
            const res = await addProject({
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

            res.data?.addProject && toggleSnackBar('Successfully created a new project!', { variant: 'success' });
          } else {
            const res = await updateProject({
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
              }
            });

            res.data?.updateProject && toggleSnackBar('Successfully updated the project!', { variant: 'success' });
          }

          return handleClose();
        }}
      >
        <Form>
          <Grid container sx={{ mt: '2rem' }} spacing={3}>
            <Grid item xs={6}>
              <ObserverTextInput id="name" type="text" name="name" label="Name" placeholder="Name" fullWidth />
            </Grid>
            <Grid item xs={6}>
              <ObserverTextInput id="rate" type="number" name="rate" label="Rate" placeholder="Rate" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <ObserverTextInput id="description" type="text" name="description" label="Description" placeholder="Description" fullWidth />
            </Grid>
            <Grid item xs={6}>
              <ObserverTextInput id="fte" type="number" name="fte" label="FTE" placeholder="FTE" fullWidth />
            </Grid>
            <Grid item xs={6}>
              <ObserverTextInput name="status" select label="Status" placeholder="Status" fullWidth>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
              </ObserverTextInput>
            </Grid>
            <Grid item xs={6}>
              <ObserverTextInput name="isBillable" select label="isBillable" placeholder="IsBillable" fullWidth>
                <MenuItem value="true">True</MenuItem>
                <MenuItem value="false">False</MenuItem>
              </ObserverTextInput>
            </Grid>
            <Grid item xs={6}>
              <ObserverTextInput name="contractTypeId" select label="Contract Type" placeholder="Contract Type" fullWidth>
                <MenuItem value={0}>Internal</MenuItem>
                <MenuItem value={1}>External</MenuItem>
                <MenuItem value={2}>Grant Fund</MenuItem>
              </ObserverTextInput>
            </Grid>
            <Grid item xs={12}>
              <DefaultContainedButton color="primary" variant="contained" startIcon={<SendIcon />} fullWidth type="submit">
                {id ? 'Update' : 'Create'}
              </DefaultContainedButton>
            </Grid>
          </Grid>
        </Form>
      </Formik>
    </>
  );
};
