import Box from '@mui/material/Box';
import { ProjectTable } from '@pages/project/components/table/ProjectTable';
import { useGetProjectListQuery } from '@graphql/project/project';
import { Typography } from '@mui/material';

export const Project = () => {
  const { data, error } = useGetProjectListQuery();
  const projects = data?.projects || [];

  return (
    <Box>
      {error ? (
        <Typography variant="subtitle1" color="error">
          {error.message}
        </Typography>
      ) : (
        <ProjectTable data={projects} />
      )}
    </Box>
  );
};
