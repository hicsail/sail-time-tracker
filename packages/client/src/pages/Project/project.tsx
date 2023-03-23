import Box from '@mui/material/Box';
import { ProjectTable } from '@pages/Project/components/table/ProjectTable';
import { useGetProjectListQuery } from '@graphql/project/project';

export const Project = () => {
  const { data, loading, error } = useGetProjectListQuery();

  if (loading || !data) return <div>Loading...</div>;

  return (
    <Box
      component="div"
      maxWidth="xl"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4rem',
        alignItems: 'start',
        width: '100%'
      }}
    >
      {error ? <pre>{error.message}</pre> : <ProjectTable rows={data.projects} />}
    </Box>
  );
};
