import { DisplayCard } from '@components/DisplayCard.component';
import { ProjectTable } from '@pages/Track/components/table/ProjectTable';
import { DropDownMenu } from '@components/form/DropDownMenu';

import { Stack, SelectChangeEvent, Typography } from '@mui/material';
import { useGetEmployeeListQuery, useGetRecordWithFavoriteProjectQuery } from '@graphql/employee/employee';
import { useEmployee } from '@context/employee.context';
import { useDate } from '@context/date.context';
import { endOfWeek, startOfWeek } from 'date-fns';
import { WorkOff, WorkOutlined } from '@mui/icons-material';

import { Day } from './components/DatePicker/Day';
import { CustomDatePickerLayout } from '@components/CustomDatePickerLayout';
import { formatDateToDashFormat } from '../../utils/helperFun';
import { StyledDatePicker } from '@components/StyledDatePicker';

export const Track = () => {
  const { employeeId, setEmployeeId } = useEmployee();
  const { date, setDate } = useDate();
  const { data: employeeListData } = useGetEmployeeListQuery();
  const { data: recordWithFavoriteProjectData } = useGetRecordWithFavoriteProjectQuery({
    variables: {
      id: employeeId as string,
      startDate: formatDateToDashFormat(startOfWeek(date, { weekStartsOn: 1 })),
      endDate: formatDateToDashFormat(endOfWeek(date, { weekStartsOn: 1 }))
    }
  });
  const recordsWithFavoriteProjects = recordWithFavoriteProjectData?.employee.recordsWithFavoriteProjects || [];

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
    const employee = employeeListData?.employees?.find((employee) => employee.id === employeeId);
    const name = employee?.name || '';
    const hours = new Date().getHours();
    const greeting = hours >= 18 ? 'Good Evening' : hours >= 12 ? 'Good Afternoon' : 'Good Morning';

    return (
      <Typography variant="body1" color="grey.500" fontSize="0.8rem">
        {`${greeting}, ${name}! Please Log Your Weekly Hours Here.`}
      </Typography>
    );
  };

  return (
    <Stack gap={8}>
      <Stack direction="row" sx={{ gap: { lg: 10, sm: 5 } }} alignItems="center">
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
          <ProjectTable data={recordsWithFavoriteProjects} />
        </Stack>
      ) : (
        <Stack
          sx={{ backgroundColor: (theme) => (theme.palette.mode === 'light' ? theme.palette.grey['200'] : theme.palette.grey['800']), height: '500px', borderRadius: '5px' }}
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="subtitle2">Please Select the Employee</Typography>
        </Stack>
      )}
    </Stack>
  );
};
