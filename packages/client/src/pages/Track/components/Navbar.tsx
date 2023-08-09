import { Stack, useTheme } from '@mui/material';
import { SwitchBtn } from '@components/switch/switchBtn';
import { useToggleTheme } from '../../../hooks/useToggleTheme';
import { Paths } from '@constants/paths';
import { Logout } from '@mui/icons-material';
import { SideListItem } from '@pages/Admin/components/SideListItem';

export const Navbar = () => {
  const { toggleTheme } = useToggleTheme();
  const theme = useTheme();

  return (
    <Stack
      justifyContent="end"
      direction="row"
      sx={{
        backgroundColor: theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.grey['800'],
        height: '5vh'
      }}
    >
      <Stack direction="row" gap={5}>
        <SideListItem path={Paths.LOGOUT} icon={<Logout sx={{ color: 'customColors.iconColor' }} />} info="Logout" />
        <SwitchBtn onClick={toggleTheme} />
      </Stack>
    </Stack>
  );
};
