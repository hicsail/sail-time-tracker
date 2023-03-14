import { DisplayCard } from '@pages/Track/components/DisplayCard.component';
import { ProjectTable } from '@pages/Track/components/table/ProjectTable';
import { Date } from '@pages/Track/components/Date.component';

import { Box, Stack, MenuItem, Select, SelectChangeEvent, InputLabel, FormControl, Container } from '@mui/material';
import { useGetEmployeeListQuery } from '@graphql/employee/employee';
import { useState } from 'react';

export const Track = () => {
  const { data, loading, error } = useGetEmployeeListQuery();
  const [selectedEmployee, setSelectedEmployee] = useState('12bf5a3f-9ede-4f60-b6ce-29920cf2e549');

  const changeHandler = (e: SelectChangeEvent) => {
    setSelectedEmployee(e.target.value as string);
  };

  return (
    <Box component="div" maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: '4rem', alignItems: 'start' }}>
      <Stack direction="row" spacing={10} sx={{ alignItems: 'center' }}>
        {error && <Container>`Fetching error! ${error.message}`</Container>}
        {loading || !data ? (
          <div>Loading...</div>
        ) : (
          <FormControl sx={{ minWidth: '200px' }}>
            <InputLabel id="employee_select-label">Select Employee</InputLabel>
            <Select name="select_employee" label="Select Employee" id="select_employee" onChange={changeHandler} value={selectedEmployee}>
              {data &&
                data.employees.map((employee) => {
                  return (
                    <MenuItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        )}
        <Date />
        <DisplayCard key="work" id="work" title="Total Work Hours" hours="10" />
        <DisplayCard key="absence" id="absence" title="Total Absence Hours" hours="2" />
      </Stack>
      <ProjectTable />
    </Box>
  );
};
