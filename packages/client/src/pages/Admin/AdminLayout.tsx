import { AdminNavbar } from '@pages/Admin/components/AdminNavbar';
import { Outlet } from 'react-router-dom';
import { SplitScreen } from '@pages/Admin/components/SplitScreen';
import { Container, useMediaQuery, useTheme } from '@mui/material';
import { useNavbar } from '@context/navbar.context';
import { TrackNavbar } from '@pages/Track/components/TrackNavbar';

export const AdminLayout = () => {
  const { open } = useNavbar();
  const theme = useTheme();
  const lessThanLarge = useMediaQuery(theme.breakpoints.down('lg'));
  return (
    <SplitScreen leftWeight={1} rightWeight={open ? 9 : 20} direction={lessThanLarge ? 'column' : 'row'}>
      {!lessThanLarge ? <AdminNavbar /> : <TrackNavbar />}
      <Container maxWidth={false} sx={{ paddingTop: 10, maxWidth: '1800px' }}>
        <Outlet />
      </Container>
    </SplitScreen>
  );
};
