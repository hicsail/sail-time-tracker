import { DisplayCard } from '@pages/Track/components/DisplayCard.component';
import { ProjectTable } from '@pages/Track/components/table/ProjectTable';
import { DatePickerComponent } from '@pages/Track/components/Date.component';

import { Box, Stack, MenuItem, Select, SelectChangeEvent, InputLabel, FormControl, Container } from '@mui/material';
import { useEmployee } from '@context/employee.context';
import { useGetEmployeeListQuery, useGetRecordWithFavoriteProjectQuery } from '@graphql/employee/employee';
import { useDate } from '@context/date.context';
import { startOfWeek } from 'date-fns';
import { useEffect } from 'react';

export const Track = () => {
  const { employeeId, setEmployeeId } = useEmployee();
  const { date } = useDate();
  const { data: employeeListData, loading: employeeListLoading, error: employeeListError } = useGetEmployeeListQuery();
  const {
    data: employeeData,
    loading: employeeLoading,
    error: employeeError,
    refetch: refechEmployeeData
  } = useGetRecordWithFavoriteProjectQuery({
    variables: {
      id: employeeId as string,
      date: startOfWeek(date, { weekStartsOn: 1 })
    }
  });

  // refetch records with favorite projects after change the date.
  useEffect(() => {
    refechEmployeeData({
      id: employeeId as string,
      date: startOfWeek(date, { weekStartsOn: 1 })
    });
  }, [date, employeeId]);

  const absenceRecord = employeeData?.employee.recordsWithFavoriteProjects.filter((project) => {
    return project.name === 'Absence';
  });

  const totalWorkHours = employeeData?.employee.recordsWithFavoriteProjects
    .filter((project) => {
      return project.name !== 'Absence';
    })
    .reduce((sum, currentProject) => sum + currentProject.hours, 0);

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
        paddingTop: '2rem'
      }}
    >
      <Stack direction="row" spacing={10} sx={{ alignItems: 'center' }}>
        {employeeListError && <Container>`Fetching error! ${employeeListError.message}`</Container>}
        {employeeListLoading || !employeeListData ? (
          <div>Loading...</div>
        ) : (
          <FormControl sx={{ minWidth: '200px' }}>
            <InputLabel id="employee_select-label">Select Employee</InputLabel>
            <Select name="select_employee" label="Select Employee" id="select_employee" onChange={changeHandler} value={employeeId ? employeeId : ''}>
              {employeeListData &&
                employeeListData.employees.map((employee: any) => {
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
        <DisplayCard key="work" id="work" title="Total Work Hours" hours={totalWorkHours ? totalWorkHours : 0} />
        <DisplayCard key="absence" id="absence" title="Total Absence Hours" hours={absenceRecord ? absenceRecord[0].hours : 0} />
      </Stack>
      {employeeId ? <ProjectTable data={employeeData} /> : <div>Please Select the Employee</div>}
    </Box>
  );
};
