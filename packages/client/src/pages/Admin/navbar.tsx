import { Box } from '@mui/material';
import { Folder, AssignmentInd, Assessment, WatchLater, Receipt } from '@mui/icons-material';
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
        position: 'fixed',
        height: '100vh'
      }}
    >
      <nav aria-label="main employees projects">
        <SideList>
          <SideListItem path={Paths.EMPLOYEE_lIST} icon={<AssignmentInd sx={{ color: 'customColors.iconColor' }} />} info="Employees" />
          <SideListItem path={Paths.PROJECT_lIST} icon={<Folder sx={{ color: 'customColors.iconColor' }} />} info="Projects" />
          <SideListItem path={Paths.REPORT} icon={<Assessment sx={{ color: 'customColors.iconColor' }} />} info="Reports" />
          <SideListItem path={Paths.INVOICE} icon={<Receipt sx={{ color: 'customColors.iconColor' }} />} info="Billing & Invoices" />
        </SideList>
      </nav>
      <nav aria-label="secondary track reports">
        <SideList>
          <SideListItem path={Paths.TRACK} icon={<WatchLater sx={{ color: 'customColors.iconColor' }} />} info="Track" />
          <SwitchBtn onClick={handleOnClick} />
        </SideList>
      </nav>
    </Box>
  );
};
