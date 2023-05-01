import { Box } from '@mui/material';
import { Folder, AssignmentInd, Assessment, WatchLater } from '@mui/icons-material';
import { Paths } from '@constants/paths';
import { SideListItem } from '@pages/Admin/sideListItem';
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
        maxWidth: 250,
        backgroundColor: 'customColors.sidebarBg',
        height: '100vh'
      }}
    >
      <nav aria-label="main employees projects">
        <SideList>
          <SideListItem path={Paths.EMPLOYEE_lIST} icon={<AssignmentInd sx={{ color: 'customColors.iconColor' }} />} info="Employees" />
          <SideListItem path={Paths.PROJECT_lIST} icon={<Folder sx={{ color: 'customColors.iconColor' }} />} info="Projects" />
        </SideList>
      </nav>
      <nav aria-label="secondary track reports">
        <SideList>
          <SideListItem path={Paths.TRACK} icon={<WatchLater sx={{ color: 'customColors.iconColor' }} />} info="Track" />
          <SideListItem path={Paths.REPORT} icon={<Assessment sx={{ color: 'customColors.iconColor' }} />} info="Reports" />
          <SwitchBtn onClick={handleOnClick} />
        </SideList>
      </nav>
    </Box>
  );
};
