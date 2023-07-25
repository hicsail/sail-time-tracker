import { DisplayCard } from '@components/DisplayCard.component';
import { ProjectTable } from '@pages/Track/components/table/ProjectTable';
import { DropDownMenu } from '@components/form/DropDownMenu';

import { Box, Stack, SelectChangeEvent, Typography } from '@mui/material';
import { useGetEmployeeListQuery, useGetRecordWithFavoriteProjectLazyQuery } from '@graphql/employee/employee';
import { useEmployee } from '@context/employee.context';
import { useDate } from '@context/date.context';
import { endOfWeek, startOfWeek } from 'date-fns';
import { useEffect } from 'react';
import { WorkOff, WorkOutlined } from '@mui/icons-material';

import { Day } from './components/DatePicker/Day';
import { CustomDatePickerLayout } from '@pages/Track/components/DatePicker/CustomDatePickerLayout';
import { formatDateToDashFormat } from '../../utils/helperFun';
import { StyledDatePicker } from '@components/StyledDatePicker';

export const Track = () => {
  const { employeeId, setEmployeeId } = useEmployee();
  const { date, setDate } = useDate();
  const { data: employeeListData } = useGetEmployeeListQuery();
  const [getRecordWithFavoriteProject, { data: recordWithFavoriteProjectData }] = useGetRecordWithFavoriteProjectLazyQuery();
  const recordsWithFavoriteProjects = recordWithFavoriteProjectData?.employee.recordsWithFavoriteProjects || [];

  useEffect(() => {
    getRecordWithFavoriteProject({
      variables: {
        id: employeeId as string,
        startDate: formatDateToDashFormat(startOfWeek(date, { weekStartsOn: 1 })),
        endDate: formatDateToDashFormat(endOfWeek(date, { weekStartsOn: 1 }))
      }
    });
  }, [employeeId, date]);

  const totalAbsenceHours = recordsWithFavoriteProjects.find((project) => project.projectName === 'Absence')?.records.reduce((sum, record) => sum + record.hours, 0) ?? 0;
  const totalWorkProjectsHours =
    recordsWithFavoriteProjects
      .filter((project) => project.projectName !== 'Absence')
      .reduce((sum, project) => {
        return (
          sum +
          project.records.reduce((innerSum: number, currentValue: any) => {
            return innerSum + currentValue.hours;
          }, 0)
        );
      }, 0) ?? 0;

  const handleSelectEmployeeOnChange = (e: SelectChangeEvent) => setEmployeeId(e.target.value);

  // get all employees and filter out the inactive employees
  const employees = employeeListData?.employees.filter((employee) => employee.status === 'Active').map((employee) => ({ id: employee.id, name: employee.name }));

  const welcomeMessage = () => {
    const name = employeeListData?.employees?.find((employee) => employee.id === employeeId)?.name || '';
    const hours = new Date().getHours();

    let message = '';

    if (hours >= 18) {
      message += 'Good Evening, ';
    } else if (hours >= 12) {
      message += 'Good Afternoon, ';
    } else {
      message += 'Good Morning, ';
    }

    message += `${name}! Please Log Your Weekly Hours Here.`;

    return (
      <Typography variant="body1" color="grey.500" fontSize="0.8rem">
        {message}
      </Typography>
    );
  };

  return (
    <Box
      maxWidth="xl"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4rem',
        paddingTop: '2rem',
        margin: 'auto'
      }}
    >
      <Stack direction="row" spacing={10} sx={{ alignItems: 'center' }}>
        <DropDownMenu
          data={employees}
          onChange={handleSelectEmployeeOnChange}
          label="Select Employee"
          value={employeeId ? employeeId : ''}
          id="select_employee"
          name="select_employee"
        />
        <StyledDatePicker
          value={date}
          onChange={(newValue: Date | null) => setDate(newValue as Date)}
          slots={{ day: Day, layout: CustomDatePickerLayout }}
          slotProps={{
            day: {
              selectedDay: date
            } as any
          }}
        />
        <DisplayCard key="work" id="work" title="Total Work Hours" data={totalWorkProjectsHours} icon={<WorkOutlined fontSize="large" />} />
        <DisplayCard key="absence" id="absence" title="Total Absence Hours" data={totalAbsenceHours} icon={<WorkOff fontSize="large" />} />
      </Stack>
      {employeeId ? (
        <Stack gap={2}>
          {welcomeMessage()}
          <ProjectTable data={recordWithFavoriteProjectData?.employee.recordsWithFavoriteProjects} />
        </Stack>
      ) : (
        <div>Please Select the Employee</div>
      )}
    </Box>
  );
};
