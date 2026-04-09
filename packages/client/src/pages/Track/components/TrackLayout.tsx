import { Box, Button, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { SwitchBtn } from '@components/switch/switchBtn';
import { useToggleTheme } from '../../../hooks/useToggleTheme';
import { NavLink } from 'react-router-dom';
import { Paths } from '@constants/paths';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import WatchLaterIcon from '@mui/icons-material/WatchLater';

export const TrackLayout = () => {
  const { toggleTheme } = useToggleTheme();
  return (
    <>
      <Box display="flex" justifyContent="flex-end" alignItems="center" gap={1} px={2}>
        <Button
          component={NavLink}
          to={Paths.TRACK}
          size="small"
          startIcon={<WatchLaterIcon />}
          sx={{
            textTransform: 'none',
            '&.active': { color: 'primary.main' }
          }}
        >
          Time Entry
        </Button>
        <Button
          component={NavLink}
          to={Paths.BURNDOWN}
          size="small"
          startIcon={<ShowChartIcon />}
          sx={{
            textTransform: 'none',
            '&.active': { color: 'primary.main' }
          }}
        >
          Burndown
        </Button>
        <SwitchBtn onClick={toggleTheme} />
      </Box>
      <Container maxWidth={false} sx={{ paddingTop: 3, maxWidth: '1800px' }}>
        <Outlet />
      </Container>
    </>
  );
};
