import { Navbar } from '@pages/Admin/components/Navbar';
import { Outlet } from 'react-router-dom';
import { SplitScreen } from '@pages/Admin/components/SplitScreen';
import { Box } from '@mui/material';

export const Admin = () => {
  return (
    <SplitScreen leftWeight={1} rightWeight={9} direction="row">
      <Navbar />
      <Box sx={{ paddingTop: 10, paddingX: 10 }}>
        <Outlet />
      </Box>
    </SplitScreen>
  );
};
