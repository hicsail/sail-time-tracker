import { Box } from '@mui/material';
import { SideList } from '@pages/Admin/components/SideList';
import { SwitchBtn } from '@components/switch/switchBtn';
import { useToggleTheme } from '../../../hooks/useToggleTheme';

export const Navbar = () => {
  const { toggleTheme } = useToggleTheme();

  return (
    <Box
      sx={{
        backgroundColor: (theme) => (theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.grey['800']),
        height: '5vh',
        display: 'flex',
        justifyContent: 'end'
      }}
    >
      <nav>
        <SideList>
          <SwitchBtn onClick={toggleTheme} />
        </SideList>
      </nav>
    </Box>
  );
};
