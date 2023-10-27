import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Employee } from '@pages/Employee/Employee';

import { GraphqlProvider } from '@graphql/graphql-provider';
import { Project } from '@pages/Project/Project';
import { Track } from '@pages/Track/Track';
import { Paths } from '@constants/paths';
import { AdminLayout } from '@pages/Admin/AdminLayout';
import { ThemeProvider } from '@theme/theme.provider';
import { SettingsProvider } from '@context/setting.context';
import { EmployeeProvider } from '@context/employee.context';
import { DateProvider } from '@context/date.context';
import { TrackLayout } from '@pages/Track/components/TrackLayout';
import { Report } from '@pages/Report/Report';
import { Invoice } from '@pages/Invoice/Invoice';
import enLocale from 'date-fns/locale/en-US';
import { InvoiceDetails } from '@pages/Invoice/InvoiceDetails';
import { DateRangeProvider } from '@context/reportFilter.context';
import { Export } from '@pages/Invoice/Export';
import { NotFoundAdmin } from '@pages/Not_Find/NotFindAdmin';
import { SnackBarProvider } from '@context/snackbar.context';
import { AuthProvider, Callback, PermissionRequired } from '@summerluna/harbor';
import { AdminGuard } from '@pages/Auth/admin.guard';
import { Logout } from '@pages/Auth/Logout';
import { Login } from '@pages/Auth/Login';
import { TrackGuard } from '@pages/Auth/track.guard';
import { NavbarProvider } from '@context/navbar.context';

function App() {
  if (enLocale && enLocale.options) {
    enLocale.options.weekStartsOn = 1;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enLocale}>
      <Router>
        <AuthProvider>
          <SettingsProvider>
            <GraphqlProvider>
              <ThemeProvider>
                <DateProvider>
                  <EmployeeProvider>
                    <DateRangeProvider>
                      <SnackBarProvider>
                        <NavbarProvider>
                          <Routes>
                            <Route element={<TrackGuard />}>
                              <Route path={Paths.TRACK} element={<TrackLayout />}>
                                <Route path={Paths.TRACK} element={<Track />} />
                              </Route>
                            </Route>
                            <Route element={<AdminGuard />}>
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
                            </Route>
                            <Route path={Paths.LOGIN} element={<Login />} />
                            <Route path={Paths.LOGOUT} element={<Logout />} />
                            <Route path="*" element={<NotFoundAdmin />} />
                            <Route path={Paths.AUTH_CALLBACK} element={<Callback />} />
                            <Route path={Paths.PERMISSION_REQUIRED} element={<PermissionRequired />} />
                          </Routes>
                        </NavbarProvider>
                      </SnackBarProvider>
                    </DateRangeProvider>
                  </EmployeeProvider>
                </DateProvider>
              </ThemeProvider>
            </GraphqlProvider>
          </SettingsProvider>
        </AuthProvider>
      </Router>
    </LocalizationProvider>
  );
}

export default App;
