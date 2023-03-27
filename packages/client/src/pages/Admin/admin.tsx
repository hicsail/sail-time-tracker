import { Navbar } from '@pages/Admin/navbar';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

export const Admin = () => {
  return (
    <Box sx={{ display: 'flex', gap: '2rem' }}>
      <Navbar />
      <Outlet />
    </Box>
  );
};
