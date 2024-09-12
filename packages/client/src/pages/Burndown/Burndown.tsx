import { Stack, Typography } from '@mui/material';
import { Toolbar } from '../Invoice/components/table/Toolbar';
import { BurndownTable } from './components/table/BurndownTable';

export const BurnDown: React.FC = () => {
  return (
    <Stack gap={8}>
      {/* Headers */}
      <Stack>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'customColors.interstellarBlue' }}>
          Burndown Charts
        </Typography>
        <Typography variant="body2" sx={{ color: 'secondary.light' }}>
          View burn down based on hours
        </Typography>
      </Stack>

      {/* Filter Options */}
      <Toolbar
        searchText=""
        dateRange={{ startDate: null, endDate: null }}
        setDateRange={(_prevState) => {}}
        setSearchText={(_searchText) => {}}
        filteredRows={[]}
        handleReset={() => {}}
        handleClearButtonClick={() => {}}
      />

      {/* Sorted Table View */}
      <BurndownTable />
    </Stack>
  );
};
