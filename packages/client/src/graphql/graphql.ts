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
};

export type BatchPayload = {
  __typename?: 'BatchPayload';
  count: Scalars['Float'];
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
  status?: Maybe<Scalars['String']>;
};

export type EmployeeUpdateInput = {
  email: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  rate: Scalars['Float'];
  status?: InputMaybe<Scalars['String']>;
};

export type FavoriteProjectCreateInput = {
  employeeId: Scalars['ID'];
  projectId: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addEmployee: EmployeeModel;
  addFavoriteProject: BatchPayload;
  addProject: ProjectModel;
  deleteEmployees: EmployeeDeleteReturnModel;
  deleteProjects: ProjectDeleteReturnModel;
  updateEmployee: EmployeeModel;
  updateProject: ProjectModel;
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

export type MutationDeleteEmployeesArgs = {
  ids: Array<Scalars['String']>;
};

export type MutationDeleteProjectsArgs = {
  ids: Array<Scalars['String']>;
};

export type MutationUpdateEmployeeArgs = {
  updateEmployee: EmployeeUpdateInput;
};

export type MutationUpdateProjectArgs = {
  updateProject: ProjectUpdateInput;
};

export type ProjectCreateInput = {
  description: Scalars['String'];
  name: Scalars['String'];
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
  name: Scalars['String'];
  status: Scalars['String'];
};

export type ProjectUpdateInput = {
  description: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  status: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  employee: EmployeeModel;
  employees: Array<EmployeeModel>;
  project: ProjectModel;
  projects: Array<ProjectModel>;
};

export type QueryEmployeeArgs = {
  id: Scalars['String'];
};

export type QueryProjectArgs = {
  id: Scalars['String'];
};
