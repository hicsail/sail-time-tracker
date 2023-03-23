import { Box, Divider } from '@mui/material';
import { Folder, AssignmentInd, Assessment, WatchLater } from '@mui/icons-material';
import { Paths } from '@constants/paths';
import { SideListItem } from '@pages/Admin/sideListItem';
import { SideList } from '@pages/Admin/sideList';

export const Navbar = () => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 300,
        backgroundColor: 'white',
        color: 'grey.50                                                                                                                              0',
        height: '100vh'
      }}
    >
      <nav aria-label="main employees projects">
        <SideList>
          <SideListItem path={Paths.EMPLOYEE_lIST} icon={<AssignmentInd sx={{ color: '#e6f1ff' }} />} info="Employees" />
          <SideListItem path={Paths.PROJECT_lIST} icon={<Folder sx={{ color: '#e6f1ff' }} />} info="Projects" />
        </SideList>
      </nav>
      <Divider sx={{ backgroundColor: '#233554' }} />
      <nav aria-label="secondary track reports">
        <SideList>
          <SideListItem path={Paths.TRACK} icon={<WatchLater sx={{ color: '#e6f1ff' }} />} info="Track" />
          <SideListItem path={Paths.TRACK} icon={<Assessment sx={{ color: '#e6f1ff' }} />} info="Reports" />
        </SideList>
      </nav>
    </Box>
  );
};
