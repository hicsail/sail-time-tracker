import Box from '@mui/material/Box';
import { EmployeeTable } from '@pages/Employee/components/table/EmployeeTable';
import { useGetEmployeeListQuery } from '@graphql/employee/employee';
import { useEffect } from 'react';

export const Employee = () => {
  const { data, loading, error } = useGetEmployeeListQuery();

  if (loading || !data) return <div>Loading...</div>;
  if (error) return <pre>{error.message}</pre>;

  return (
    <Box component="div" maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: '4rem', alignItems: 'start' }}>
      <EmployeeTable rows={data.employees} />
    </Box>
  );
};
