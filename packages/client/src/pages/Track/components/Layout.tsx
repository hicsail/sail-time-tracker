import { Container } from '@mui/material';
import { Navbar } from '@pages/Track/components/Navbar';
import { Navbar as AdminNavbar } from '@pages/Admin/components/Navbar';
import { Outlet } from 'react-router-dom';
import { SplitScreen } from '@pages/Admin/components/SplitScreen';
import { useAuth } from '@summerluna/harbor';

export const TrackLayout = () => {
  const { decoded_token } = useAuth();
  return (
    <SplitScreen leftWeight={1} rightWeight={7} direction="column">
      {decoded_token?.role === 1 ? <AdminNavbar /> : <Navbar />}
      <Container maxWidth="xl">
        <Outlet />
      </Container>
    </SplitScreen>
  );
};
