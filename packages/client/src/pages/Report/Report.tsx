import { GroupByEmployee } from '@pages/Report/GroupByEmployee';
import { GroupByProject } from '@pages/Report/GroupByProject';
import { useState } from 'react';
import { DropDownMenu } from '@components/form/DropDownMenu';
import { Box, InputAdornment, SelectChangeEvent, Stack } from '@mui/material';
import { endOfWeek, startOfWeek } from 'date-fns';
import SearchIcon from '@mui/icons-material/Search';
import { TextInput } from '@components/TextInput';
import { useDateRange } from '@context/reportFilter.context';
import { StyledDatePicker } from '@components/StyledDatePicker';
import { MenuOptions } from '@pages/Report/components/MoreOption';

export const Report = () => {
  const [searchText, setSearchText] = useState<string>('');
  const date = new Date();
  const { dateRange, setDateRange, groupBy, setGroupBy } = useDateRange();

  const data = [
    { id: '1', name: 'Employee' },
    { id: '2', name: 'Project' }
  ];

  const handleOnChange = (e: SelectChangeEvent) => setGroupBy(e.target.value);

  return (
    <Stack>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
        <Box>
          <DropDownMenu data={data} onChange={handleOnChange} value={groupBy} label="Group By" name="select_group_by" id="select_group_by" />
        </Box>
        <Box sx={{ display: 'flex', gap: 5 }}>
          <StyledDatePicker
            label="Start Date"
            value={dateRange.startDate}
            onChange={(newValue: Date | null) => {
              setDateRange((prevState: any) => ({
                ...prevState,
                startDate: newValue
              }));
            }}
          />
          <StyledDatePicker
            label="End Date"
            value={dateRange.endDate}
            onChange={(newValue: Date | null) => {
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
        <MenuOptions
          startDate={dateRange.startDate ? dateRange.startDate : startOfWeek(date, { weekStartsOn: 1 })}
          endDate={dateRange.endDate ? dateRange.endDate : endOfWeek(date, { weekStartsOn: 1 })}
        />
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
