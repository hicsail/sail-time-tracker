import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Employee } from '@pages/Employee/employee';

import { GraphqlProvider } from '@graphql/graphql-provider';
import { Project } from '@pages/Project/project';
import { Track } from '@pages/Track/track';
import { Paths } from '@constants/paths';
import { Admin } from '@pages/Admin/admin';
import { ThemeProvider } from '@theme/theme.provider';
import { SettingsProvider } from '@context/setting.context';
import { EmployeeProvider } from '@context/employee.context';
import { DateProvider } from '@context/date.context';
import { TrackLayout } from '@pages/Track/components/Layout';
import { Report } from '@pages/Report/Report';
import { Invoice } from '@pages/Invoice/Invoice';
import enLocale from 'date-fns/locale/en-US';
import { InvoiceDetails } from '@pages/Invoice/InvoiceDetails';

function App() {
  if (enLocale && enLocale.options) {
    enLocale.options.weekStartsOn = 1;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enLocale}>
      <GraphqlProvider>
        <SettingsProvider>
          <ThemeProvider>
            <DateProvider>
              <Router>
                <EmployeeProvider>
                  <Routes>
                    <Route path={Paths.TRACK} element={<TrackLayout />}>
                      <Route path={Paths.TRACK} element={<Track />} />
                    </Route>
                    <Route path={Paths.ADMIN} element={<Admin />}>
                      <Route path={Paths.PROJECT_lIST} element={<Project />}>
                        <Route path={Paths.EDIT_PROJECT} />
                        <Route path={Paths.ADD_PROJECT} />
                      </Route>
                      <Route path={Paths.EMPLOYEE_lIST} element={<Employee />}>
                        <Route path={Paths.EDIT_EMPLOYEE} />
                        <Route path={Paths.ADD_EMPLOYEE} />
                      </Route>
                      <Route path={Paths.REPORT} element={<Report />} />
                      <Route path={Paths.INVOICE} element={<Invoice />} />
                      <Route path={Paths.INVOICE_DETAIL} element={<InvoiceDetails />} />
                    </Route>
                  </Routes>
                </EmployeeProvider>
              </Router>
            </DateProvider>
          </ThemeProvider>
        </SettingsProvider>
      </GraphqlProvider>
    </LocalizationProvider>
  );
}

export default App;
