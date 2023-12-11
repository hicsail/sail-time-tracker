import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Employee } from '@pages/employee/Employee';

import { GraphqlProvider } from '@graphql/graphql-provider';
import { Project } from '@pages/project/Project';
import { Track } from '@pages/track/Track';
import { Paths } from '@constants/paths';
import { AdminLayout } from '@pages/admin/AdminLayout';
import { ThemeProvider } from '@theme/theme.provider';
import { SettingsProvider } from '@context/setting.context';
import { EmployeeProvider } from '@context/employee.context';
import { DateProvider } from '@context/date.context';
import { TrackLayout } from '@pages/track/components/TrackLayout';
import { Report } from '@pages/report/Report';
import { Invoice } from '@pages/invoice/Invoice';
import enLocale from 'date-fns/locale/en-US';
import { InvoiceDetails } from '@pages/invoice/InvoiceDetails';
import { DateRangeProvider } from '@context/reportFilter.context';
import { Export } from '@pages/invoice/Export';
import { NotFoundAdmin } from '@pages/not-found/NotFindAdmin';
import { SnackBarProvider } from '@context/snackbar.context';
import { NavbarProvider } from '@context/navbar.context';

function App() {
  if (enLocale && enLocale.options) {
    enLocale.options.weekStartsOn = 1;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enLocale}>
      <Router>
        <SettingsProvider>
          <GraphqlProvider>
            <ThemeProvider>
              <DateProvider>
                <EmployeeProvider>
                  <DateRangeProvider>
                    <SnackBarProvider>
                      <NavbarProvider>
                        <Routes>
                          <Route element={<TrackLayout />}>
                            <Route path={Paths.TRACK} element={<Track />} />
                          </Route>
                          <Route path={Paths.ADMIN} element={<AdminLayout />}>
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
                            <Route path={Paths.EXPORT_INVOICE} element={<Export />} />
                            <Route path={`${Paths.ADMIN}/*`} element={<NotFoundAdmin page="admin" />} />
                          </Route>
                          <Route path="*" element={<NotFoundAdmin />} />
                        </Routes>
                      </NavbarProvider>
                    </SnackBarProvider>
                  </DateRangeProvider>
                </EmployeeProvider>
              </DateProvider>
            </ThemeProvider>
          </GraphqlProvider>
        </SettingsProvider>
      </Router>
    </LocalizationProvider>
  );
}

export default App;
