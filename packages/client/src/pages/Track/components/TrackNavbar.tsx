import { Box, Drawer, IconButton, Stack, useMediaQuery, useTheme } from '@mui/material';
import { SwitchBtn } from '@components/switch/switchBtn';
import { useToggleTheme } from '../../../hooks/useToggleTheme';
import { Paths } from '@constants/paths';
import { Assessment, AssignmentInd, Folder, Logout, Receipt, WatchLater } from '@mui/icons-material';
import { SideListItem } from '@pages/Admin/components/SideListItem';
import { useAuth } from '@summerluna/harbor';
import MenuIcon from '@mui/icons-material/Menu';
import { SideList } from '@pages/Admin/components/SideList';
import { useNavbar } from '@context/navbar.context';

export const TrackNavbar = () => {
  const { toggleTheme } = useToggleTheme();
  const { decoded_token } = useAuth();
  const isAdmin = decoded_token?.role === 1;
  const theme = useTheme();
  const lessThanLarge = useMediaQuery(theme.breakpoints.down('lg'));
  const { open, handleToggle } = useNavbar();

  return (
    <Stack
      justifyContent="end"
      direction="row"
      sx={{
        backgroundColor: theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.grey['800'],
        height: '5vh',
        position: 'fixed',
        width: '100%',
        zIndex: 20
      }}
    >
      {isAdmin && lessThanLarge && (
        <Box marginRight="auto" paddingLeft={3} marginY="auto">
          <IconButton onClick={handleToggle}>
            <MenuIcon sx={{ color: 'customColors.iconColor' }} />
          </IconButton>
        </Box>
      )}
      {!isAdmin && (
        <Stack direction="row" gap={3}>
          <SideListItem path={Paths.LOGOUT} icon={<Logout sx={{ color: 'customColors.iconColor' }} />} info="Logout" />
          <SwitchBtn onClick={toggleTheme} />
        </Stack>
      )}
      <Drawer
        anchor="left"
        open={open}
        onClose={handleToggle}
        onClick={handleToggle}
        PaperProps={{
          sx: {
            bgcolor: theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.grey['800']
          }
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
          <SideListItem path={Paths.LOGOUT} icon={<Logout sx={{ color: 'customColors.iconColor' }} />} info="Logout" />
          <SwitchBtn onClick={toggleTheme} />
        </SideList>
      </Drawer>
    </Stack>
  );
};
