import { Date } from '@components/Date.component';
import { DisplayCard } from '@components/DisplayCard.component';
import { ProjectTable } from '@components/table/ProjectTable';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

export const Track = () => {
  return (
    <Box component="div" maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: '4rem', alignItems: 'start' }}>
      <Stack direction="row" spacing={10} sx={{ alignItems: 'center' }}>
        <Date />
        <DisplayCard key="work" id="work" title="Total Work Hours" hours="10" />
        <DisplayCard key="absence" id="absence" title="Total Absence Hours" hours="2" />
      </Stack>
      <ProjectTable />
    </Box>
  );
};
