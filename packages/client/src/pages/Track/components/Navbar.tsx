import { Box } from '@mui/material';
import { SideList } from '@pages/Admin/sideList';
import { SwitchBtn } from '@components/switch/switchBtn';
import { useSettings } from '@context/setting.context';

export const Navbar = () => {
  const { settings, setSettings } = useSettings();

  const handleOnClick = () => {
    if (settings.theme === 'light') {
      setSettings({ theme: 'dark' });
    } else {
      setSettings({ theme: 'light' });
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'customColors.sidebarBg',
        height: '5vh',
        display: 'flex',
        justifyContent: 'end'
      }}
    >
      <nav aria-label="secondary track theme">
        <SideList>
          <SwitchBtn onClick={handleOnClick} />
        </SideList>
      </nav>
    </Box>
  );
};
