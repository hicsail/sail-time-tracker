import { Box } from '@mui/material';
import { Navbar } from '@pages/Track/components/Navbar';
import { Outlet } from 'react-router-dom';

export const TrackLayout = () => {
  return (
    <Box sx={{ display: 'flex', gap: '2rem' }}>
      <Navbar />
      <Outlet />
    </Box>
  );
};
