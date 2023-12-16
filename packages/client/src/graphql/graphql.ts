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
  JSON: any;
};

export type BatchPayload = {
  __typename?: 'BatchPayload';
  count: Scalars['Float'];
};

export type BatchResponseModel = {
  __typename?: 'BatchResponseModel';
  count: Scalars['Float'];
  message: Scalars['String'];
  success: Scalars['Boolean'];
};

export type BatchSendSlackMessageInput = {
  employeeIds: Array<Scalars['String']>;
  message: Scalars['String'];
};

export type ClickUpStatuses = {
  __typename?: 'ClickUpStatuses';
  color: Scalars['String'];
  id: Scalars['String'];
  orderindex: Scalars['Float'];
  status: Scalars['String'];
  type: Scalars['String'];
};

export type ClickUpTaskCreateInput = {
  custom_fields: Array<ClickUpTaskCustomFieldsInput>;
  description: Scalars['String'];
  name: Scalars['String'];
  status: Scalars['String'];
};

export type ClickUpTaskCustomFieldsInput = {
  id: Scalars['String'];
  value?: InputMaybe<Scalars['JSON']>;
};

export type ClickUpTaskInput = {
  id: Scalars['String'];
  url: Scalars['String'];
};

export type ClickUpTaskModel = {
  __typename?: 'ClickUpTaskModel';
  id: Scalars['String'];
  url: Scalars['String'];
};

export type ClickUpTaskUpdateInput = {
  custom_fields: Array<ClickUpTaskCustomFieldsInput>;
  description: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  status: Scalars['String'];
};

export type CommentCreateInput = {
  content: Scalars['String'];
  deletable?: InputMaybe<Scalars['Boolean']>;
  invoiceId: Scalars['String'];
};

export type CommentModel = {
  __typename?: 'CommentModel';
  commentId: Scalars['String'];
  content: Scalars['String'];
  createDate: Scalars['DateTime'];
  deletable: Scalars['Boolean'];
  invoiceId: Scalars['String'];
};

export type ContractTypeModel = {
  __typename?: 'ContractTypeModel';
  id: Scalars['Float'];
  name: Scalars['String'];
};

export type DateRangeInput = {
  endDate: Scalars['DateTime'];
  startDate: Scalars['DateTime'];
};

export type EmployeeCreateInput = {
  email: Scalars['String'];
  name: Scalars['String'];
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
  recordsWithFavoriteProjects: Array<GroupedRecordWithFavoriteProjectModel>;
  status?: Maybe<Scalars['String']>;
};

export type EmployeeModelRecordsWithFavoriteProjectsArgs = {
  endDate: Scalars['DateTime'];
  startDate: Scalars['DateTime'];
};

export type EmployeeUpdateInput = {
  email: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  status?: InputMaybe<Scalars['String']>;
};

export type EmployeeWithRecord = {
  __typename?: 'EmployeeWithRecord';
  billableHours: Scalars['Float'];
  id: Scalars['String'];
  indirectHours: Scalars['Float'];
  inner: Array<EmployeeWithRecordInner>;
  name: Scalars['String'];
  status: Scalars['String'];
  workHours: Scalars['Float'];
};

export type EmployeeWithRecordInner = {
  __typename?: 'EmployeeWithRecordInner';
  billableHours: Scalars['Float'];
  contractTypeId: Scalars['Float'];
  fte: Scalars['Float'];
  isBillable: Scalars['Boolean'];
  projectId: Scalars['String'];
  projectIndirectHours: Scalars['Float'];
  projectName: Scalars['String'];
  projectPercentage: Scalars['String'];
  projectWorkHours: Scalars['Float'];
  rate: Scalars['Float'];
  status: Scalars['String'];
};

export type FavoriteProjectCreateInput = {
  employeeId: Scalars['ID'];
  projectId: Scalars['ID'];
};

export type GroupedRecordWithFavoriteProjectModel = {
  __typename?: 'GroupedRecordWithFavoriteProjectModel';
  description: Scalars['String'];
  isFavorite: Scalars['Boolean'];
  projectId: Scalars['String'];
  projectName: Scalars['String'];
  records: Array<RecordWithFavoriteProjectModel>;
};

export type InvoiceCreateInput = {
  amount: Scalars['Float'];
  endDate: Scalars['DateTime'];
  hours: Scalars['Float'];
  projectId: Scalars['String'];
  rate: Scalars['Float'];
  startDate: Scalars['DateTime'];
};

export type InvoiceItemModel = {
  __typename?: 'InvoiceItemModel';
  amount: Scalars['Float'];
  billableHours: Scalars['Float'];
  employee: EmployeeModel;
  indirectHours: Scalars['Float'];
  invoiceId: Scalars['String'];
  rate: Scalars['Float'];
  workHours: Scalars['Float'];
};

export type InvoiceItemUpdateInput = {
  employeeId: Scalars['String'];
  indirectHours?: InputMaybe<Scalars['Float']>;
  invoiceId: Scalars['String'];
  workHours?: InputMaybe<Scalars['Float']>;
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
  project?: Maybe<ProjectWithContractType>;
  projectId: Scalars['String'];
  rate: Scalars['Float'];
  startDate: Scalars['DateTime'];
};

export type InvoiceModelWithProjectAndComments = {
  __typename?: 'InvoiceModelWithProjectAndComments';
  amount: Scalars['Float'];
  clickUpTask?: Maybe<ClickUpTaskModel>;
  comments?: Maybe<Array<CommentModel>>;
  endDate: Scalars['DateTime'];
  hours: Scalars['Float'];
  invoiceId: Scalars['String'];
  items?: Maybe<Array<InvoiceItemModel>>;
  project?: Maybe<ProjectWithContractType>;
  projectId: Scalars['String'];
  rate: Scalars['Float'];
  startDate: Scalars['DateTime'];
};

export type InvoiceSearchInput = {
  endDate: Scalars['DateTime'];
  projectId: Scalars['String'];
  startDate: Scalars['DateTime'];
};

export type ListCustomField = {
  __typename?: 'ListCustomField';
  id: Scalars['String'];
  name: Scalars['String'];
  required?: Maybe<Scalars['Boolean']>;
  type: Scalars['String'];
  type_config: ListCustomFieldTypeConfig;
};

export type ListCustomFieldTypeConfig = {
  __typename?: 'ListCustomFieldTypeConfig';
  options?: Maybe<Array<ListCustomFieldTypeConfigOptions>>;
};

export type ListCustomFieldTypeConfigOptions = {
  __typename?: 'ListCustomFieldTypeConfigOptions';
  id: Scalars['String'];
  label?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  orderindex?: Maybe<Scalars['Float']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addComment: CommentModel;
  addEmployee: EmployeeModel;
  addFavoriteProject: BatchPayload;
  addProject: ProjectModel;
  addSlackUser: BatchPayload;
  batchSendingMessages: BatchResponseModel;
  createAndAddClickUpTaskToInvoice: ClickUpTaskModel;
  createClickUpTask: ClickUpTaskModel;
  createOrUpdateInvoice: InvoiceModel;
  deleteComment: CommentModel;
  deleteEmployees: EmployeeDeleteReturnModel;
  deleteFavoriteProjects: BatchPayload;
  deleteInvoice: InvoiceModel;
  deleteProjects: ProjectDeleteReturnModel;
  deleteRecord: BatchPayload;
  insertOrUpdateRecord: RecordInsertOrUpdateModel;
  sendSlackMessage: Scalars['Boolean'];
  updateClickUpTask: ClickUpTaskModel;
  updateEmployee: EmployeeModel;
  updateInvoiceItem: InvoiceItemModel;
  updateProject: ProjectWithContractType;
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

export type MutationAddSlackUserArgs = {
  slackUsers: Array<SlackEmployeeInput>;
};

export type MutationBatchSendingMessagesArgs = {
  input: BatchSendSlackMessageInput;
};

export type MutationCreateAndAddClickUpTaskToInvoiceArgs = {
  invoiceId: Scalars['String'];
  task: ClickUpTaskInput;
};

export type MutationCreateClickUpTaskArgs = {
  task: ClickUpTaskCreateInput;
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

export type MutationDeleteInvoiceArgs = {
  projectId_startDate_endDate: InvoiceSearchInput;
};

export type MutationDeleteProjectsArgs = {
  ids: Array<Scalars['String']>;
};

export type MutationDeleteRecordArgs = {
  input: RecordDeleteInput;
};

export type MutationInsertOrUpdateRecordArgs = {
  record: RecordCreateInput;
};

export type MutationSendSlackMessageArgs = {
  slackSendMessageInput: SendSlackMessageInput;
};

export type MutationUpdateClickUpTaskArgs = {
  task: ClickUpTaskUpdateInput;
};

export type MutationUpdateEmployeeArgs = {
  updateEmployee: EmployeeUpdateInput;
};

export type MutationUpdateInvoiceItemArgs = {
  updatedInvoiceItem: InvoiceItemUpdateInput;
};

export type MutationUpdateProjectArgs = {
  updateProject: ProjectUpdateInput;
};

export type ProjectCreateInput = {
  contractTypeId: Scalars['Float'];
  description: Scalars['String'];
  fte: Scalars['Float'];
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
  fte: Scalars['Float'];
  id: Scalars['ID'];
  isBillable: Scalars['Boolean'];
  name: Scalars['String'];
  rate: Scalars['Float'];
  status: Scalars['String'];
};

export type ProjectUpdateInput = {
  contractTypeId: Scalars['Float'];
  description: Scalars['String'];
  fte: Scalars['Float'];
  id: Scalars['ID'];
  isBillable: Scalars['Boolean'];
  name: Scalars['String'];
  rate: Scalars['Float'];
  status: Scalars['String'];
};

export type ProjectWithContractType = {
  __typename?: 'ProjectWithContractType';
  contractType: ContractTypeModel;
  description: Scalars['String'];
  fte: Scalars['Float'];
  id: Scalars['ID'];
  isBillable: Scalars['Boolean'];
  name: Scalars['String'];
  rate: Scalars['Float'];
  status: Scalars['String'];
};

export type ProjectWithEmployeeRecords = {
  __typename?: 'ProjectWithEmployeeRecords';
  billableHours: Scalars['Float'];
  contractTypeId: Scalars['Float'];
  fte: Scalars['Float'];
  id: Scalars['String'];
  indirectHours: Scalars['Float'];
  inner: Array<ProjectWithEmployeeRecordsInner>;
  isBillable: Scalars['Boolean'];
  name: Scalars['String'];
  percentage: Scalars['String'];
  rate: Scalars['Float'];
  status: Scalars['String'];
  workHours: Scalars['Float'];
};

export type ProjectWithEmployeeRecordsInner = {
  __typename?: 'ProjectWithEmployeeRecordsInner';
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
  findNextInvoice?: Maybe<InvoiceModelWithProjectAndComments>;
  findPreviousInvoice?: Maybe<InvoiceModelWithProjectAndComments>;
  getClickUpCustomFields: Array<ListCustomField>;
  getClickUpStatuses: Array<ClickUpStatuses>;
  getClickUpTask?: Maybe<Scalars['Boolean']>;
  getEmployeesWithRecord: Array<EmployeeWithRecord>;
  getProjectWithEmployeeRecords: Array<ProjectWithEmployeeRecords>;
  getRecordsByDateRange: Array<RecordModel>;
  invoices: Array<InvoiceModelWithProject>;
  project: ProjectWithContractType;
  projects: Array<ProjectWithContractType>;
  searchInvoice: InvoiceModelWithProjectAndComments;
  searchInvoicesByDateRange: Array<InvoiceModel>;
};

export type QueryCommentArgs = {
  id: Scalars['String'];
};

export type QueryEmployeeArgs = {
  id: Scalars['String'];
};

export type QueryFindNextInvoiceArgs = {
  endDate: Scalars['DateTime'];
  projectId: Scalars['String'];
};

export type QueryFindPreviousInvoiceArgs = {
  projectId: Scalars['String'];
  startDate: Scalars['DateTime'];
};

export type QueryGetClickUpTaskArgs = {
  taskId: Scalars['String'];
};

export type QueryGetEmployeesWithRecordArgs = {
  endDate: Scalars['DateTime'];
  startDate: Scalars['DateTime'];
};

export type QueryGetProjectWithEmployeeRecordsArgs = {
  endDate: Scalars['DateTime'];
  startDate: Scalars['DateTime'];
};

export type QueryGetRecordsByDateRangeArgs = {
  input: DateRangeInput;
};

export type QueryProjectArgs = {
  id: Scalars['String'];
};

export type QuerySearchInvoiceArgs = {
  projectId_startDate_endDate: InvoiceSearchInput;
};

export type QuerySearchInvoicesByDateRangeArgs = {
  endDate: Scalars['DateTime'];
  startDate: Scalars['DateTime'];
};

export type RecordCreateInput = {
  date: Scalars['DateTime'];
  employeeId: Scalars['ID'];
  hours: Scalars['Float'];
  projectId: Scalars['ID'];
};

export type RecordDeleteInput = {
  employeeId: Scalars['ID'];
  endDate?: InputMaybe<Scalars['DateTime']>;
  projectIds: Array<Scalars['String']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
};

export type RecordInsertOrUpdateModel = {
  __typename?: 'RecordInsertOrUpdateModel';
  date: Scalars['DateTime'];
  employeeId: Scalars['ID'];
  hours: Scalars['Float'];
  id?: Maybe<Scalars['String']>;
  projectId: Scalars['ID'];
};

export type RecordModel = {
  __typename?: 'RecordModel';
  date: Scalars['DateTime'];
  employee: EmployeeModel;
  employeeId: Scalars['ID'];
  hours: Scalars['Float'];
  id?: Maybe<Scalars['String']>;
  project: ProjectModel;
  projectId: Scalars['ID'];
};

export type RecordWithFavoriteProjectModel = {
  __typename?: 'RecordWithFavoriteProjectModel';
  date?: Maybe<Scalars['String']>;
  hours: Scalars['Float'];
};

export type SendSlackMessageInput = {
  employeeId: Scalars['String'];
  message: Scalars['String'];
};

export type SlackEmployeeInput = {
  employeeId: Scalars['String'];
  slackId: Scalars['String'];
};
