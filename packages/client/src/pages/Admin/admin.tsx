import { Navbar } from '@pages/Admin/navbar';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

export const Admin = () => {
  return (
    <Box>
      <Navbar />
      <Box sx={{marginLeft: 40, width: "100%"}}>
        <Outlet />
      </Box>
    </Box>
  );
};
