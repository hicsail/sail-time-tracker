import { styled } from '@mui/material';
import { ArrowBackIosNewRounded, Assessment, AssignmentInd, Folder, Logout, Receipt, WatchLater } from '@mui/icons-material';
import { Paths } from '@constants/paths';
import { SideListItem } from '@pages/Admin/components/SideListItem';
import { SideList } from '@pages/Admin/components/SideList';
import { useToggleTheme } from '../../../hooks/useToggleTheme';
import { SwitchBtn } from '@components/switch/switchBtn';
import { IconButton } from '@mui/material';
import { useNavbar } from '@context/navbar.context';

export const AdminNavbar = () => {
  const { toggleTheme } = useToggleTheme();
  const { open, handleToggle } = useNavbar();

  const Nav = styled('nav')(({ theme }) => ({
    padding: '0 1rem',
    borderRight: `1px dashed rgba(145, 158, 171, 0.2)`,
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey['100'] : theme.palette.grey['900'],
    height: '100vh',
    color: theme.palette.mode === 'light' ? theme.palette.grey['600'] : theme.palette.grey['500'],
    ...(!open && { width: '100px' })
  }));

  return (
    <Nav>
      <IconButton size="small" sx={{ float: 'right', border: '1px dashed grey', marginRight: -3.2, marginTop: 2, marginBottom: 2 }} onClick={handleToggle}>
        {open ? (
          <ArrowBackIosNewRounded sx={{ fontSize: '15px', color: 'grey.600' }} />
        ) : (
          <ArrowBackIosNewRounded sx={{ fontSize: '15px', color: 'grey.600', transform: 'rotate(180deg)' }} />
        )}
      </IconButton>
      <SideList>
        <SideListItem path={Paths.EMPLOYEE_lIST} icon={<AssignmentInd sx={{ color: 'customColors.iconColor' }} />} info="Employees" open={open} />
        <SideListItem path={Paths.PROJECT_lIST} icon={<Folder sx={{ color: 'customColors.iconColor' }} />} info="Projects" open={open} />
        <SideListItem path={Paths.REPORT} icon={<Assessment sx={{ color: 'customColors.iconColor' }} />} info="Reports" open={open} />
        <SideListItem path={Paths.INVOICE} icon={<Receipt sx={{ color: 'customColors.iconColor' }} />} info="Billing & Invoices" open={open} />
      </SideList>
      <SideList>
        <SideListItem path={Paths.TRACK} icon={<WatchLater sx={{ color: 'customColors.iconColor' }} />} info="Track" open={open} />
        <SideListItem path={Paths.LOGOUT} icon={<Logout sx={{ color: 'customColors.iconColor' }} />} info="Logout" open={open} />
        <SwitchBtn onClick={toggleTheme} open={open} />
      </SideList>
    </Nav>
  );
};
