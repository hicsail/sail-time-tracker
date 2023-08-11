import { Container, useMediaQuery, useTheme } from '@mui/material';
import { TrackNavbar } from '@pages/Track/components/TrackNavbar';
import { AdminNavbar } from '@pages/Admin/components/AdminNavbar';
import { Outlet } from 'react-router-dom';
import { SplitScreen } from '@pages/Admin/components/SplitScreen';
import { useAuth } from '@summerluna/harbor';
import { useNavbar } from '@context/navbar.context';

export const TrackLayout = () => {
  const { decoded_token } = useAuth();
  const { open } = useNavbar();
  const isAdmin = decoded_token?.role === 1;
  const theme = useTheme();
  const lessThanLarge = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <SplitScreen leftWeight={1} rightWeight={open ? 9 : 20} direction={lessThanLarge || !isAdmin ? 'column' : 'row'}>
      {isAdmin && !lessThanLarge ? <AdminNavbar /> : <TrackNavbar />}
      <Container maxWidth={false} sx={{ paddingTop: 10, maxWidth: '1800px' }}>
        <Outlet />
      </Container>
    </SplitScreen>
  );
};
