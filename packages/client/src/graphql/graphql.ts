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

export type EmployeeCreateInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  rate: Scalars['Float'];
  status?: InputMaybe<Scalars['String']>;
};

export type EmployeeModel = {
  __typename?: 'EmployeeModel';
  email: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  rate: Scalars['Float'];
  status?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addEmployee: EmployeeModel;
  addProject: ProjectModel;
};

export type MutationAddEmployeeArgs = {
  employee: EmployeeCreateInput;
};

export type MutationAddProjectArgs = {
  project: ProjectCreateInput;
};

export type ProjectCreateInput = {
  name: Scalars['String'];
  status: Scalars['String'];
};

export type ProjectModel = {
  __typename?: 'ProjectModel';
  id: Scalars['ID'];
  name: Scalars['String'];
  status: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  employees: Array<EmployeeModel>;
  projects: Array<ProjectModel>;
};
