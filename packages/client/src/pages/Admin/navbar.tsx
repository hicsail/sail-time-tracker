import { Box } from '@mui/material';
import { Folder, AssignmentInd, Assessment, WatchLater } from '@mui/icons-material';
import { Paths } from '@constants/paths';
import { SideListItem } from '@pages/Admin/sideListItem';
import { SideList } from '@pages/Admin/sideList';
import { SwitchBtn } from '@components/switch/switchBtn';

export const Navbar = () => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 300,
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
          <SideListItem path={Paths.TRACK} icon={<Assessment sx={{ color: 'customColors.iconColor' }} />} info="Reports" />
        </SideList>
      </nav>
      <nav aria-label="secondary track reports">
        <SideList>
          <SideListItem path="" icon={<SwitchBtn />} info="Theme" />
        </SideList>
      </nav>
    </Box>
  );
};
