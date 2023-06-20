import Box from '@mui/material/Box';
import { ProjectTable } from '@pages/Project/components/table/ProjectTable';
import { useGetProjectListQuery } from '@graphql/project/project';

export const Project = () => {
  const { data, loading, error } = useGetProjectListQuery();

  if (loading || !data) return <div>Loading...</div>;

  return <Box>{error ? <pre>{error.message}</pre> : <ProjectTable data={data.projects} />}</Box>;
};
