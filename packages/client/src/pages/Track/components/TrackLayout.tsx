import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import { TrackNavbar } from '@pages/Track/components/TrackNavbar';
import { AdminNavbar } from '@pages/Admin/components/AdminNavbar';
import { Outlet } from 'react-router-dom';
import { SplitScreen } from '@pages/Admin/components/SplitScreen';
import { useNavbar } from '@context/navbar.context';
import { SwitchBtn } from '@components/switch/switchBtn';
import { useToggleTheme } from '../../../hooks/useToggleTheme';

export const TrackLayout = () => {
  const { toggleTheme } = useToggleTheme();
  return (
    <>
      <Box display="flex" justifyContent="flex-end">
        <SwitchBtn onClick={toggleTheme} />
      </Box>
      <Container maxWidth={false} sx={{ paddingTop: 15, maxWidth: '1800px' }}>
        <Outlet />
      </Container>
    </>
  );
};
