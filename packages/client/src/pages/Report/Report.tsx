import { GroupByEmployee } from '@pages/Report/GroupByEmployee';
import { GroupByProject } from '@pages/Report/GroupByProject';
import { useState } from 'react';
import { DropDownMenu } from '@components/form/DropDownMenu';
import { Box, SelectChangeEvent, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { endOfWeek, startOfWeek } from 'date-fns';

export const Report = () => {
  const [groupBy, setGroupBy] = useState<string>('1');
  const date = new Date();
  const [dateRange, setDateRage] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: startOfWeek(date, { weekStartsOn: 1 }),
    endDate: endOfWeek(date, { weekStartsOn: 1 })
  });

  const data = [
    { id: '1', name: 'Employee' },
    { id: '2', name: 'Project' }
  ];

  const handleOnChange = (e: SelectChangeEvent) => {
    setGroupBy(e.target.value);
  };

  return (
    <Box sx={{ width: '80%', margin: 'auto', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8, marginBottom: 5 }}>
        <Box>
          <DropDownMenu data={data} onChange={handleOnChange} defaultValue={groupBy} label="Group By" name="select_group_by" id="select_group_by" />
        </Box>
        <Box sx={{ display: 'flex', gap: 5 }}>
          <DatePicker
            label="Start Date"
            value={dateRange.startDate}
            onChange={(newValue) => {
              setDateRage((prevState) => ({
                ...prevState,
                startDate: newValue
              }));
            }}
            renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            label="End Date"
            value={dateRange.endDate}
            onChange={(newValue) => {
              setDateRage((prevState) => ({
                ...prevState,
                endDate: newValue
              }));
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>
      </Box>
      {groupBy === '1' ? (
        <GroupByEmployee
          startDate={dateRange.startDate ? startOfWeek(dateRange.startDate, { weekStartsOn: 1 }) : startOfWeek(date, { weekStartsOn: 1 })}
          endDate={dateRange.endDate ? startOfWeek(dateRange.endDate, { weekStartsOn: 1 }) : startOfWeek(date, { weekStartsOn: 1 })}
        />
      ) : (
        <GroupByProject
          startDate={dateRange.startDate ? startOfWeek(dateRange.startDate, { weekStartsOn: 1 }) : startOfWeek(date, { weekStartsOn: 1 })}
          endDate={dateRange.endDate ? startOfWeek(dateRange.endDate, { weekStartsOn: 1 }) : startOfWeek(date, { weekStartsOn: 1 })}
        />
      )}
    </Box>
  );
};
