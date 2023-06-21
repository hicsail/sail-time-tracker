import { styled } from '@mui/material';
import { Folder, AssignmentInd, Assessment, WatchLater, Receipt } from '@mui/icons-material';
import { Paths } from '@constants/paths';
import { SideListItem } from '@pages/Admin/components/SideListItem';
import { SwitchBtn } from '@components/switch/switchBtn';
import { useSettings } from '@context/setting.context';
import { SideList } from '@pages/Admin/components/SideList';

export const Navbar = () => {
  const { settings, setSettings } = useSettings();

  const handleOnClick = () => {
    if (settings.theme === 'light') {
      return setSettings({ theme: 'dark' });
    }

    return setSettings({ theme: 'light' });
  };

  const Nav = styled('nav')(({ theme }) => ({
    padding: '0 1rem',
    borderRight: `1px dashed rgba(145, 158, 171, 0.2)`,
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey['100'] : theme.palette.grey['900'],
    position: 'fixed',
    height: '100vh',
    color: theme.palette.mode === 'light' ? theme.palette.grey['600'] : theme.palette.grey['500']
  }));

  return (
    <Nav>
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
    </Nav>
  );
};
