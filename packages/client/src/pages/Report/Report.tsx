import { GroupByEmployee } from '@pages/Report/GroupByEmployee';
import { GroupByProject } from '@pages/Report/GroupByProject';
import { useState } from 'react';
import { DropDownMenu } from '@components/form/DropDownMenu';
import { Box, InputAdornment, SelectChangeEvent, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { endOfWeek, startOfWeek } from 'date-fns';
import SearchIcon from '@mui/icons-material/Search';
import { TextInput } from '@components/TextInput';
import { useDateRange } from '@context/reportFilter.context';

export const Report = () => {
  const [searchText, setSearchText] = useState<string>('');
  const date = new Date();
  const { dateRange, setDateRange, groupBy, setGroupBy } = useDateRange();

  const data = [
    { id: '1', name: 'Employee' },
    { id: '2', name: 'Project' }
  ];

  const handleOnChange = (e: SelectChangeEvent) => {
    setGroupBy(e.target.value);
  };

  return (
    <Stack direction="column">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8, marginBottom: 5 }}>
        <Box>
          <DropDownMenu data={data} onChange={handleOnChange} value={groupBy} label="Group By" name="select_group_by" id="select_group_by" />
        </Box>
        <Box sx={{ display: 'flex', gap: 5 }}>
          <DatePicker
            label="Start Date"
            value={dateRange.startDate}
            onChange={(newValue) => {
              setDateRange((prevState: any) => ({
                ...prevState,
                startDate: newValue
              }));
            }}
          />
          <DatePicker
            label="End Date"
            value={dateRange.endDate}
            onChange={(newValue) => {
              setDateRange((prevState: any) => ({
                ...prevState,
                endDate: newValue
              }));
            }}
          />
        </Box>
        <Box sx={{ width: '49%' }}>
          <TextInput
            value={searchText}
            setValue={setSearchText}
            id="search-reports"
            variant="outlined"
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ mr: 1, color: 'grey.500' }} />
                </InputAdornment>
              )
            }}
          />
        </Box>
      </Box>
      {groupBy === '1' ? (
        <GroupByEmployee
          startDate={dateRange.startDate ? dateRange.startDate : startOfWeek(date, { weekStartsOn: 1 })}
          endDate={dateRange.endDate ? dateRange.endDate : endOfWeek(date, { weekStartsOn: 1 })}
          searchText={searchText}
        />
      ) : (
        <GroupByProject
          startDate={dateRange.startDate ? dateRange.startDate : startOfWeek(date, { weekStartsOn: 1 })}
          endDate={dateRange.endDate ? dateRange.endDate : endOfWeek(date, { weekStartsOn: 1 })}
          searchText={searchText}
        />
      )}
    </Stack>
  );
};
