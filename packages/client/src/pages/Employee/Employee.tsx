import Box from '@mui/material/Box';
import { EmployeeTable } from '@pages/Employee/components/table/EmployeeTable';
import { useGetEmployeeListQuery } from '@graphql/employee/employee';
import { Typography } from '@mui/material';

export const Employee = () => {
  const { data, error } = useGetEmployeeListQuery();
  const employees = data?.employees || [];

  return (
    <Box>
      {error ? (
        <Typography variant="subtitle1" color="error">
          {error.message}
        </Typography>
      ) : (
        <EmployeeTable data={employees} />
      )}
    </Box>
  );
};
