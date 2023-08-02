import { Box, Button, Chip, Paper, Stack } from '@mui/material';
import { StyledDatePicker } from '@components/StyledDatePicker';
import { SearchBar } from '@components/SearchBar';
import { format } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { FC } from 'react';

interface ToolbarProps {
  searchText: string;
  dateRange: { startDate: Date | null; endDate: Date | null };
  setDateRange: (prevState: any) => void;
  setSearchText: (searchText: string) => void;
  filteredRows: any[];
  handleReset: () => void;
  handleClearButtonClick: () => void;
}

export const Toolbar: FC<ToolbarProps> = ({ setSearchText, searchText, dateRange, setDateRange, filteredRows, handleReset, handleClearButtonClick }) => {
  return (
    <Stack gap={5}>
      <Stack direction="row" gap={2}>
        <Stack direction="row" gap={5}>
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
        </Stack>
        <SearchBar id="search invoices" value={searchText} setValue={setSearchText} />
      </Stack>
      <Stack>
        {(searchText !== '' || (dateRange.startDate && dateRange.endDate)) && (
          <Box sx={{ marginBottom: 2 }}>
            <strong>{filteredRows.length}</strong>{' '}
            <Box component="span" sx={{ color: 'grey.600' }}>
              results found
            </Box>
          </Box>
        )}
        <Stack direction="row" alignItems="center">
          {dateRange.startDate && dateRange.endDate && (
            <Paper
              variant="outlined"
              sx={{
                border: '1px dashed',
                borderColor: 'grey.300',
                borderRadius: '8px',
                display: 'flex',
                gap: '8px',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50px',
                width: '250px',
                padding: '0 8px',
                backgroundColor: 'inherit'
              }}
            >
              <Box component="span" sx={{ fontWeight: 'medium' }}>
                Date:
              </Box>
              <Stack direction="row" gap="8px">
                <Chip
                  label={dateRange.startDate && dateRange.endDate && `${format(dateRange.startDate, 'dd MMM yy')} - ${format(dateRange.endDate, 'dd MMM yy')}`}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: (theme) => (theme.palette.mode === 'light' ? 'grey.900' : theme.palette.common.white),
                    color: (theme) => (theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.grey[900]),
                    '& .MuiSvgIcon-root': { color: 'grey.500' }
                  }}
                  onDelete={handleReset}
                />
              </Stack>
            </Paper>
          )}
          {(searchText !== '' || (dateRange.startDate && dateRange.endDate)) && (
            <Button onClick={handleClearButtonClick} sx={{ color: 'error.main', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <DeleteIcon /> Clear
            </Button>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
