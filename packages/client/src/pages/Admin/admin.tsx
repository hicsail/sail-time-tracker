import { Navbar } from '@pages/Admin/navbar';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

export const Admin = () => {
  return (
    <Box component="div" sx={{ display: 'flex' }}>
      <Navbar />
      <Outlet />
    </Box>
  );
};
