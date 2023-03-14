import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Employee } from '@pages/Employee/employee';

import { GraphqlProvider } from '@graphql/graphql-provider';
import { AddEmployee } from '@pages/Employee/addEmployee';
import { Project } from '@pages/Project/project';
import { AddProject } from '@pages/Project/addProject';
import { Track } from '@pages/Track/track';
import { Paths } from '@constants/paths';
import { EditEmployee } from '@pages/Employee/EditEmployee';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <GraphqlProvider>
        <Router>
          <Routes>
            <Route path={Paths.TRACK} element={<Track />} />
            <Route path={Paths.ADMIN} element={<Track />} />
            <Route path={Paths.PROJECT_lIST} element={<Project />} />
            <Route path={Paths.ADD_PROJECT} element={<AddProject />} />
            <Route path={Paths.EDIT_PROJECT} element={<AddProject />} />
            <Route path={Paths.EMPLOYEE_lIST} element={<Employee />} />
            <Route path={Paths.ADD_EMPLOYEE} element={<AddEmployee />} />
            <Route path={Paths.EDIT_EMPLOYEE} element={<EditEmployee />} />
          </Routes>
        </Router>
      </GraphqlProvider>
    </LocalizationProvider>
  );
}

export default App;
