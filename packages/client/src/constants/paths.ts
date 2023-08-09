export enum Paths {
  TRACK = '/',
  ADMIN = '/admin',
  REPORT = '/admin/report',
  INVOICE = '/admin/invoice',
  INVOICE_DETAIL = '/admin/invoice/:id/:startDate/:endDate',
  EXPORT_INVOICE = '/admin/invoice/export',
  PROJECT_lIST = '/admin/projects',
  ADD_PROJECT = '/admin/projects/add',
  EDIT_PROJECT = '/admin/projects/:id',
  EMPLOYEE_lIST = '/admin/employees',
  ADD_EMPLOYEE = '/admin/employees/add',
  EDIT_EMPLOYEE = '/admin/employees/:id',
  LOGOUT = '/logout',
  LOGIN = '/login',
  AUTH_CALLBACK = '/auth/callback',
  PERMISSION_REQUIRED = '/permission-required'
}
