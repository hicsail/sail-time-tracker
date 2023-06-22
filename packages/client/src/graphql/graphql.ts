/* Generated File DO NOT EDIT. */
/* tslint:disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type BatchPayload = {
  __typename?: 'BatchPayload';
  count: Scalars['Float'];
};

export type CommentCreateInput = {
  content: Scalars['String'];
  invoiceId: Scalars['String'];
};

export type CommentModel = {
  __typename?: 'CommentModel';
  commentId: Scalars['String'];
  content: Scalars['String'];
  createDate: Scalars['DateTime'];
  invoiceId: Scalars['String'];
};

export type EmployeeCreateInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  rate: Scalars['Float'];
  status?: InputMaybe<Scalars['String']>;
};

export type EmployeeDeleteReturnModel = {
  __typename?: 'EmployeeDeleteReturnModel';
  count: Scalars['Float'];
};

export type EmployeeModel = {
  __typename?: 'EmployeeModel';
  email: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  projects: Array<ProjectModel>;
  rate: Scalars['Float'];
  recordsWithFavoriteProjects: Array<RecordWithFavoriteProjectModel>;
  status?: Maybe<Scalars['String']>;
};

export type EmployeeModelRecordsWithFavoriteProjectsArgs = {
  date: Scalars['DateTime'];
};

export type EmployeeUpdateInput = {
  email: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  rate: Scalars['Float'];
  status?: InputMaybe<Scalars['String']>;
};

export type EmployeeWithRecord = {
  __typename?: 'EmployeeWithRecord';
  billableHours: Scalars['Float'];
  id: Scalars['String'];
  indirectHours: Scalars['Float'];
  inner: Array<EmployeeWithRecordInner>;
  name: Scalars['String'];
  workHours: Scalars['Float'];
};

export type EmployeeWithRecordInner = {
  __typename?: 'EmployeeWithRecordInner';
  isBillable: Scalars['Boolean'];
  projectId: Scalars['String'];
  projectIndirectHours: Scalars['Float'];
  projectName: Scalars['String'];
  projectPercentage: Scalars['String'];
  projectWorkHours: Scalars['Float'];
};

export type FavoriteProjectCreateInput = {
  employeeId: Scalars['ID'];
  projectId: Scalars['ID'];
};

export type InvoiceCreateInput = {
  amount: Scalars['Float'];
  endDate: Scalars['DateTime'];
  hours: Scalars['Float'];
  projectId: Scalars['String'];
  rate: Scalars['Float'];
  startDate: Scalars['DateTime'];
};

export type InvoiceModel = {
  __typename?: 'InvoiceModel';
  amount: Scalars['Float'];
  endDate: Scalars['DateTime'];
  hours: Scalars['Float'];
  invoiceId: Scalars['String'];
  projectId: Scalars['String'];
  rate: Scalars['Float'];
  startDate: Scalars['DateTime'];
};

export type InvoiceModelWithProject = {
  __typename?: 'InvoiceModelWithProject';
  amount: Scalars['Float'];
  endDate: Scalars['DateTime'];
  hours: Scalars['Float'];
  invoiceId: Scalars['String'];
  project: ProjectModel;
  projectId: Scalars['String'];
  rate: Scalars['Float'];
  startDate: Scalars['DateTime'];
};

export type InvoiceModelWithProjectAndComments = {
  __typename?: 'InvoiceModelWithProjectAndComments';
  amount: Scalars['Float'];
  comments: Array<CommentModel>;
  endDate: Scalars['DateTime'];
  hours: Scalars['Float'];
  invoiceId: Scalars['String'];
  project: ProjectModel;
  projectId: Scalars['String'];
  rate: Scalars['Float'];
  startDate: Scalars['DateTime'];
};

export type InvoiceSearchInput = {
  endDate: Scalars['DateTime'];
  projectId: Scalars['String'];
  startDate: Scalars['DateTime'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addComment: CommentModel;
  addEmployee: EmployeeModel;
  addFavoriteProject: BatchPayload;
  addProject: ProjectModel;
  createOrUpdateInvoice: InvoiceModel;
  deleteComment: CommentModel;
  deleteEmployees: EmployeeDeleteReturnModel;
  deleteFavoriteProjects: BatchPayload;
  deleteProjects: ProjectDeleteReturnModel;
  insertOrUpdateRecord: RecordInsertOrUpdateModel;
  updateEmployee: EmployeeModel;
  updateProject: ProjectModel;
};

export type MutationAddCommentArgs = {
  input: CommentCreateInput;
};

export type MutationAddEmployeeArgs = {
  employee: EmployeeCreateInput;
};

export type MutationAddFavoriteProjectArgs = {
  favoriteProject: Array<FavoriteProjectCreateInput>;
};

export type MutationAddProjectArgs = {
  project: ProjectCreateInput;
};

export type MutationCreateOrUpdateInvoiceArgs = {
  invoice: InvoiceCreateInput;
};

export type MutationDeleteCommentArgs = {
  id: Scalars['String'];
};

export type MutationDeleteEmployeesArgs = {
  ids: Array<Scalars['String']>;
};

export type MutationDeleteFavoriteProjectsArgs = {
  employeeId: Scalars['String'];
  projectIds: Array<Scalars['String']>;
};

export type MutationDeleteProjectsArgs = {
  ids: Array<Scalars['String']>;
};

export type MutationInsertOrUpdateRecordArgs = {
  record: RecordCreateInput;
};

export type MutationUpdateEmployeeArgs = {
  updateEmployee: EmployeeUpdateInput;
};

export type MutationUpdateProjectArgs = {
  updateProject: ProjectUpdateInput;
};

export type ProjectCreateInput = {
  description: Scalars['String'];
  isBillable: Scalars['Boolean'];
  name: Scalars['String'];
  rate: Scalars['Float'];
  status: Scalars['String'];
};

export type ProjectDeleteReturnModel = {
  __typename?: 'ProjectDeleteReturnModel';
  count: Scalars['Float'];
};

export type ProjectModel = {
  __typename?: 'ProjectModel';
  description: Scalars['String'];
  id: Scalars['ID'];
  isBillable: Scalars['Boolean'];
  name: Scalars['String'];
  rate: Scalars['Float'];
  status: Scalars['String'];
};

export type ProjectUpdateInput = {
  description: Scalars['String'];
  id: Scalars['ID'];
  isBillable: Scalars['Boolean'];
  name: Scalars['String'];
  rate: Scalars['Float'];
  status: Scalars['String'];
};

export type ProjectWithRecord = {
  __typename?: 'ProjectWithRecord';
  billableHours: Scalars['Float'];
  id: Scalars['String'];
  indirectHours: Scalars['Float'];
  inner: Array<ProjectWithRecordInner>;
  isBillable: Scalars['Boolean'];
  name: Scalars['String'];
  percentage: Scalars['String'];
  rate: Scalars['Float'];
  workHours: Scalars['Float'];
};

export type ProjectWithRecordInner = {
  __typename?: 'ProjectWithRecordInner';
  employeeId: Scalars['String'];
  employeeIndirectHours: Scalars['Float'];
  employeeName: Scalars['String'];
  employeePercentage: Scalars['String'];
  employeeWorkHours: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  comment: CommentModel;
  comments: Array<CommentModel>;
  employee: EmployeeModel;
  employees: Array<EmployeeModel>;
  getEmployeesWithRecord: Array<EmployeeWithRecord>;
  getProjectsWithRecord: Array<ProjectWithRecord>;
  invoices: Array<InvoiceModelWithProject>;
  project: ProjectModel;
  projects: Array<ProjectModel>;
  searchInvoice: InvoiceModelWithProjectAndComments;
};

export type QueryCommentArgs = {
  id: Scalars['String'];
};

export type QueryEmployeeArgs = {
  id: Scalars['String'];
};

export type QueryGetEmployeesWithRecordArgs = {
  endDate: Scalars['DateTime'];
  startDate: Scalars['DateTime'];
};

export type QueryGetProjectsWithRecordArgs = {
  endDate: Scalars['DateTime'];
  startDate: Scalars['DateTime'];
};

export type QueryProjectArgs = {
  id: Scalars['String'];
};

export type QuerySearchInvoiceArgs = {
  projectId_startDate_endDate: InvoiceSearchInput;
};

export type RecordCreateInput = {
  date: Scalars['DateTime'];
  employeeId: Scalars['ID'];
  hours: Scalars['Float'];
  projectId: Scalars['ID'];
};

export type RecordInsertOrUpdateModel = {
  __typename?: 'RecordInsertOrUpdateModel';
  date: Scalars['DateTime'];
  employeeId: Scalars['ID'];
  hours: Scalars['Float'];
  projectId: Scalars['ID'];
};

export type RecordWithFavoriteProjectModel = {
  __typename?: 'RecordWithFavoriteProjectModel';
  description: Scalars['String'];
  hours: Scalars['Float'];
  id: Scalars['ID'];
  isBillable: Scalars['Boolean'];
  isFavorite: Scalars['Boolean'];
  name: Scalars['String'];
  previousWeek: Scalars['Float'];
  rate: Scalars['Float'];
  status: Scalars['String'];
};
