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
      component="nav"
      sx={{
        paddingRight: '2rem',
        backgroundColor: 'customColors.sidebarBg',
        position: 'fixed',
        height: '100vh'
      }}
    >
      <SideList>
        <SideListItem path={Paths.EMPLOYEE_lIST} icon={<AssignmentInd sx={{ color: 'customColors.iconColor' }} />} info="Employees" />
        <SideListItem path={Paths.PROJECT_lIST} icon={<Folder sx={{ color: 'customColors.iconColor' }} />} info="Projects" />
        <SideListItem path={Paths.REPORT} icon={<Assessment sx={{ color: 'customColors.iconColor' }} />} info="Reports" />
        <SideListItem path={Paths.INVOICE} icon={<Receipt sx={{ color: 'customColors.iconColor' }} />} info="Billing & Invoices" />
      </SideList>
      <SideList>
        <SideListItem path={Paths.TRACK} icon={<WatchLater sx={{ color: 'customColors.iconColor' }} />} info="Track" />
        <SwitchBtn onClick={handleOnClick} />
      </SideList>
    </Box>
  );
};
