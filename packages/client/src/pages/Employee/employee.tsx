import Box from '@mui/material/Box';
import { EmployeeTable } from '@pages/Employee/components/table/EmployeeTable';
import { useGetEmployeeListQuery } from '@graphql/employee/employee';

export const Employee = () => {
  const { data, loading, error } = useGetEmployeeListQuery();

  if (loading || !data) return <div>Loading...</div>;

  return (
    <Box component="div" maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: '4rem', alignItems: 'start' }}>
      {error ? <pre>{error.message}</pre> : <EmployeeTable rows={data.employees} />}
    </Box>
  );
};
