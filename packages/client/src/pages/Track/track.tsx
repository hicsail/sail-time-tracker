import { DisplayCard } from '@pages/Track/components/DisplayCard.component';
import { ProjectTable } from '@pages/Track/components/table/ProjectTable';
import { DatePickerComponent } from '@pages/Track/components/Date.component';

import { Box, Stack, MenuItem, Select, SelectChangeEvent, InputLabel, FormControl, Container } from '@mui/material';
import { useGetEmployeeListQuery } from '@graphql/employee/employee';
import { useEmployee } from '@context/employee.context';

export const Track = () => {
  const { data, loading, error } = useGetEmployeeListQuery();
  const { employeeId, setEmployeeId } = useEmployee();

  const changeHandler = (e: SelectChangeEvent) => {
    setEmployeeId(e.target.value);
  };

  return (
    <Box
      component="div"
      maxWidth="lg"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4rem',
        alignItems: 'start',
        margin: 'auto',
        paddingTop: '10rem'
      }}
    >
      <Stack direction="row" spacing={10} sx={{ alignItems: 'center' }}>
        {error && <Container>`Fetching error! ${error.message}`</Container>}
        {loading || !data ? (
          <div>Loading...</div>
        ) : (
          <FormControl sx={{ minWidth: '200px' }}>
            <InputLabel id="employee_select-label">Select Employee</InputLabel>
            <Select name="select_employee" label="Select Employee" id="select_employee" onChange={changeHandler} value={employeeId ? employeeId : ''}>
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
        <DatePickerComponent />
        <DisplayCard key="work" id="work" title="Total Work Hours" hours="10" />
        <DisplayCard key="absence" id="absence" title="Total Absence Hours" hours="2" />
      </Stack>
      <ProjectTable />
    </Box>
  );
};
