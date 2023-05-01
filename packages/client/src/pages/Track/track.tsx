import { DisplayCard } from '@pages/Track/components/DisplayCard.component';
import { ProjectTable } from '@pages/Track/components/table/ProjectTable';
import { DropDownMenu } from '@components/form/DropDownMenu';

import { Box, Stack, SelectChangeEvent, TextField } from '@mui/material';
import { useGetEmployeeListQuery, useGetRecordWithFavoriteProjectQuery } from '@graphql/employee/employee';
import { useEmployee } from '@context/employee.context';
import { useDate } from '@context/date.context';
import { startOfWeek } from 'date-fns';
import { useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export const Track = () => {
  const { employeeId, setEmployeeId } = useEmployee();
  const { date, setDate } = useDate();
  const { data: employeeListData } = useGetEmployeeListQuery();
  const { data: employeeData, refetch: refechEmployeeData } = useGetRecordWithFavoriteProjectQuery({
    variables: {
      id: employeeId as string,
      date: startOfWeek(date, { weekStartsOn: 1 })
    }
  });

  // re-fetch records with favorite projects after change the date.
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

  /**
   * employee dropdown change handler
   * @param e
   */
  const employeeChangeHandler = (e: SelectChangeEvent) => {
    setEmployeeId(e.target.value);
  };

  const employees = employeeListData?.employees.map((employee) => {
    return { id: employee.id, name: employee.name };
  });

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
        <DropDownMenu data={employees} onChange={employeeChangeHandler} label="Select Employee" defaultValue={employeeId} id="select_employee" name="select_employee" />
        <DatePicker
          label="Date"
          value={date}
          onChange={(newValue) => {
            setDate(newValue as Date);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
        <DisplayCard key="work" id="work" title="Total Work Hours" hours={totalWorkHours ? totalWorkHours : 0} />
        <DisplayCard key="absence" id="absence" title="Total Absence Hours" hours={absenceRecord ? absenceRecord[0].hours : 0} />
      </Stack>
      {employeeId ? <ProjectTable data={employeeData} /> : <div>Please Select the Employee</div>}
    </Box>
  );
};
