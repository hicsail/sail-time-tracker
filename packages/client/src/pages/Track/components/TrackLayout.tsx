import { Container, useMediaQuery, useTheme } from '@mui/material';
import { TrackNavbar } from '@pages/Track/components/TrackNavbar';
import { AdminNavbar } from '@pages/Admin/components/AdminNavbar';
import { Outlet } from 'react-router-dom';
import { SplitScreen } from '@pages/Admin/components/SplitScreen';
import { useNavbar } from '@context/navbar.context';

export const TrackLayout = () => {
  const { open } = useNavbar();
  const theme = useTheme();
  const lessThanLarge = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <SplitScreen leftWeight={1} rightWeight={open ? 9 : 20} direction={lessThanLarge ? 'column' : 'row'}>
      {!lessThanLarge ? <AdminNavbar /> : <TrackNavbar />}
      <Container maxWidth={false} sx={{ paddingTop: 15, maxWidth: '1800px' }}>
        <Outlet />
      </Container>
    </SplitScreen>
  );
};
