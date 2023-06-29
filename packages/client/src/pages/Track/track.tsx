import { DisplayCard } from '@components/DisplayCard.component';
import { ProjectTable } from '@pages/Track/components/table/ProjectTable';
import { DropDownMenu } from '@components/form/DropDownMenu';

import { Box, Stack, SelectChangeEvent } from '@mui/material';
import { useGetEmployeeListQuery, useGetRecordWithFavoriteProjectLazyQuery } from '@graphql/employee/employee';
import { useEmployee } from '@context/employee.context';
import { useDate } from '@context/date.context';
import { endOfWeek, startOfWeek } from 'date-fns';
import { useEffect } from 'react';
import { WorkOff, WorkOutlined } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';

import { Day } from './components/Day';
import { formatDateToDashFormat } from '../../utils/helperFun';

export const Track = () => {
  const { employeeId, setEmployeeId } = useEmployee();
  const { date, setDate } = useDate();
  const { data: employeeListData } = useGetEmployeeListQuery();
  const [getRecordWithFavoriteProject, { data: recordWithFavoriteProjectData }] = useGetRecordWithFavoriteProjectLazyQuery();

  useEffect(() => {
    getRecordWithFavoriteProject({
      variables: {
        id: employeeId as string,
        startDate: formatDateToDashFormat(startOfWeek(date, { weekStartsOn: 1 })),
        endDate: formatDateToDashFormat(endOfWeek(date, { weekStartsOn: 1 }))
      }
    });
  }, [employeeId, date]);

  const totalAbsenceHours =
    recordWithFavoriteProjectData?.employee.recordsWithFavoriteProjects
      .find((project) => {
        return project.projectName === 'Absence';
      })
      ?.records.reduce((sum, record) => sum + record.hours, 0) ?? 0;

  const workProjectsHours = recordWithFavoriteProjectData?.employee.recordsWithFavoriteProjects
    .filter((project) => {
      return project.projectName !== 'Absence';
    })
    .reduce((sum, project) => {
      return (
        sum +
        project.records.reduce((innerSum: number, currentValue: any) => {
          return innerSum + currentValue.hours;
        }, 0)
      );
    }, 0);

  /**
   * employee dropdown change handler
   * @param e
   */
  const employeeChangeHandler = (e: SelectChangeEvent) => {
    setEmployeeId(e.target.value);
  };

  const employees = employeeListData?.employees
    .filter((employee) => employee.status === 'Active')
    .map((employee) => {
      return { id: employee.id, name: employee.name };
    });

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
        <DropDownMenu data={employees} onChange={employeeChangeHandler} label="Select Employee" value={employeeId ? employeeId : ''} id="select_employee" name="select_employee" />
        <DatePicker
          value={date}
          onChange={(newValue) => {
            setDate(newValue as Date);
          }}
          slots={{ day: Day }}
          slotProps={{
            day: {
              selectedDay: date
            } as any
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'grey.300',
                color: 'grey.500'
              }
            }
          }}
        />
        <DisplayCard key="work" id="work" title="Total Work Hours" data={workProjectsHours} icon={<WorkOutlined fontSize="large" />} />
        <DisplayCard key="absence" id="absence" title="Total Absence Hours" data={totalAbsenceHours} icon={<WorkOff fontSize="large" />} />
      </Stack>
      {employeeId ? <ProjectTable data={recordWithFavoriteProjectData?.employee.recordsWithFavoriteProjects} /> : <div>Please Select the Employee</div>}
    </Box>
  );
};
