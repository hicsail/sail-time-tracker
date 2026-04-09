import { Box, Button, Chip, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Stack, Tooltip } from '@mui/material';
import { StyledDatePicker } from '@components/StyledDatePicker';
import { SearchBar } from '@components/SearchBar';
import { format, startOfMonth, lastDayOfMonth, subMonths, addMonths } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import React, { FC } from 'react';

function fiscalYear(offset = 0): { startDate: Date; endDate: Date } {
  const today = new Date();
  const fyStartYear = (today.getMonth() >= 6 ? today.getFullYear() : today.getFullYear() - 1) + offset;
  return { startDate: new Date(fyStartYear, 6, 1), endDate: new Date(fyStartYear + 1, 5, 30) };
}

function fiscalYearLabel(offset = 0): string {
  const { startDate, endDate } = fiscalYear(offset);
  return `FY ${startDate.getFullYear()}–${String(endDate.getFullYear()).slice(2)}`;
}

interface ToolbarProps {
  searchText: string;
  dateRange: { startDate: Date | null; endDate: Date | null };
  setDateRange: (prevState: any) => void;
  setSearchText: (searchText: string) => void;
  filteredRows: any[];
  handleReset: () => void;
  handleClearButtonClick: () => void;
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  projects: { id: string; name: string }[];
}

export const Toolbar: FC<ToolbarProps> = ({
  setSearchText,
  searchText,
  dateRange,
  setDateRange,
  filteredRows,
  handleReset,
  handleClearButtonClick,
  selectedProjectId,
  setSelectedProjectId,
  projects
}) => {
  const applyPreset = (range: { startDate: Date; endDate: Date }) => {
    setDateRange(range);
  };

  return (
    <Stack gap={3}>
      <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
        <Button
          size="small"
          variant="outlined"
          startIcon={<AccessTimeIcon />}
          onClick={() => applyPreset({ startDate: startOfMonth(subMonths(new Date(), 1)), endDate: lastDayOfMonth(subMonths(new Date(), 1)) })}
        >
          Last Month
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => applyPreset({ startDate: startOfMonth(new Date()), endDate: lastDayOfMonth(new Date()) })}
        >
          This Month
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => applyPreset(fiscalYear(0))}
        >
          {fiscalYearLabel(0)}
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => applyPreset(fiscalYear(-1))}
        >
          {fiscalYearLabel(-1)}
        </Button>
      </Stack>
      <Stack direction="row" gap={2} alignItems="center" flexWrap="wrap">
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Project</InputLabel>
          <Select value={selectedProjectId} label="Project" onChange={(e) => setSelectedProjectId(e.target.value)}>
            <MenuItem value="">All projects</MenuItem>
            {projects.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Tooltip title="-1 month">
          <span>
            <IconButton
              size="small"
              disabled={!dateRange.startDate || !dateRange.endDate}
              onClick={() => {
                if (dateRange.startDate && dateRange.endDate)
                  setDateRange({ startDate: subMonths(dateRange.startDate, 1), endDate: subMonths(dateRange.endDate, 1) });
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          </span>
        </Tooltip>
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
        <Tooltip title="+1 month">
          <span>
            <IconButton
              size="small"
              disabled={!dateRange.startDate || !dateRange.endDate}
              onClick={() => {
                if (dateRange.startDate && dateRange.endDate)
                  setDateRange({ startDate: addMonths(dateRange.startDate, 1), endDate: addMonths(dateRange.endDate, 1) });
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </span>
        </Tooltip>
        <SearchBar id="search invoices" value={searchText} setValue={setSearchText} />
      </Stack>
      <Stack>
        {(searchText !== '' || (dateRange.startDate && dateRange.endDate) || selectedProjectId) && (
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
          {(searchText !== '' || (dateRange.startDate && dateRange.endDate) || selectedProjectId) && (
            <Button onClick={handleClearButtonClick} sx={{ color: 'error.main', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <DeleteIcon /> Clear
            </Button>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
