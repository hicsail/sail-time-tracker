import { Container } from '@mui/material';
import { Navbar } from '@pages/Track/components/Navbar';
import { Outlet } from 'react-router-dom';
import { SplitScreen } from '@pages/Admin/components/SplitScreen';

export const TrackLayout = () => {
  return (
    <SplitScreen leftWeight={1} rightWeight={7} direction="column">
      <Navbar />
      <Container maxWidth="xl">
        <Outlet />
      </Container>
    </SplitScreen>
  );
};
