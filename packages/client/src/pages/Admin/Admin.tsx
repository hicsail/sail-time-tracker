import { Navbar } from '@pages/Admin/components/Navbar';
import { Outlet } from 'react-router-dom';
import { SplitScreen } from '@pages/Admin/components/SplitScreen';
import { Box } from '@mui/material';

export const Admin = () => {
  return (
    <SplitScreen leftWeight={1} rightWeight={7}>
      <Navbar />
      <Box sx={{ width: '80%', margin: 'auto' }}>
        <Outlet />
      </Box>
    </SplitScreen>
  );
};
