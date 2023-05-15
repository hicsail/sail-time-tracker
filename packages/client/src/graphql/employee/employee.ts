/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetEmployeeListQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetEmployeeListQuery = {
  __typename?: 'Query';
  employees: Array<{ __typename?: 'EmployeeModel'; id: string; email: string; name: string; rate: number; status?: string | null }>;
};

export type GetEmployeeListWithRecordQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetEmployeeListWithRecordQuery = {
  __typename?: 'Query';
  employees: Array<{
    __typename?: 'EmployeeModel';
    id: string;
    name: string;
    records: Array<{ __typename?: 'RecordModelWithProject'; startDate: any; endDate: any; hours: number; project: { __typename?: 'ProjectModel'; id: string; name: string } }>;
  }>;
};

export type GetEmployeeByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;

export type GetEmployeeByIdQuery = {
  __typename?: 'Query';
  employee: {
    __typename?: 'EmployeeModel';
    id: string;
    name: string;
    email: string;
    rate: number;
    status?: string | null;
    projects: Array<{ __typename?: 'ProjectModel'; id: string; name: string; description: string; status: string; isBillable: boolean }>;
  };
};

export type GetRecordWithFavoriteProjectQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
  date: Types.Scalars['DateTime'];
}>;

export type GetRecordWithFavoriteProjectQuery = {
  __typename?: 'Query';
  employee: {
    __typename?: 'EmployeeModel';
    id: string;
    name: string;
    email: string;
    rate: number;
    status?: string | null;
    projects: Array<{ __typename?: 'ProjectModel'; id: string; name: string; description: string; status: string; isBillable: boolean }>;
    recordsWithFavoriteProjects: Array<{
      __typename?: 'RecordWithFavoriteProjectModel';
      id: string;
      name: string;
      description: string;
      status: string;
      hours: number;
      isFavorite: boolean;
      previousWeek: number;
    }>;
  };
};

export type EmployeeCreateInputMutationVariables = Types.Exact<{
  newEmployee: Types.EmployeeCreateInput;
}>;

export type EmployeeCreateInputMutation = { __typename?: 'Mutation'; addEmployee: { __typename?: 'EmployeeModel'; id: string; email: string; name: string; rate: number } };

export type EmployeeUpdateInputMutationVariables = Types.Exact<{
  updateEmployee: Types.EmployeeUpdateInput;
}>;

export type EmployeeUpdateInputMutation = {
  __typename?: 'Mutation';
  updateEmployee: { __typename?: 'EmployeeModel'; id: string; name: string; email: string; rate: number; status?: string | null };
};

export type DeleteEmployeesMutationVariables = Types.Exact<{
  ids: Array<Types.Scalars['String']> | Types.Scalars['String'];
}>;

export type DeleteEmployeesMutation = { __typename?: 'Mutation'; deleteEmployees: { __typename?: 'EmployeeDeleteReturnModel'; count: number } };

export const GetEmployeeListDocument = gql`
  query getEmployeeList {
    employees {
      id
      email
      name
      rate
      status
    }
  }
`;

/**
 * __useGetEmployeeListQuery__
 *
 * To run a query within a React component, call `useGetEmployeeListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEmployeeListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEmployeeListQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetEmployeeListQuery(baseOptions?: Apollo.QueryHookOptions<GetEmployeeListQuery, GetEmployeeListQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetEmployeeListQuery, GetEmployeeListQueryVariables>(GetEmployeeListDocument, options);
}
export function useGetEmployeeListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEmployeeListQuery, GetEmployeeListQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetEmployeeListQuery, GetEmployeeListQueryVariables>(GetEmployeeListDocument, options);
}
export type GetEmployeeListQueryHookResult = ReturnType<typeof useGetEmployeeListQuery>;
export type GetEmployeeListLazyQueryHookResult = ReturnType<typeof useGetEmployeeListLazyQuery>;
export type GetEmployeeListQueryResult = Apollo.QueryResult<GetEmployeeListQuery, GetEmployeeListQueryVariables>;
export const GetEmployeeListWithRecordDocument = gql`
  query getEmployeeListWithRecord {
    employees {
      id
      name
      records(date: Date) {
        startDate
        endDate
        hours
        project {
          id
          name
        }
      }
    }
  }
`;

/**
 * __useGetEmployeeListWithRecordQuery__
 *
 * To run a query within a React component, call `useGetEmployeeListWithRecordQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEmployeeListWithRecordQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEmployeeListWithRecordQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetEmployeeListWithRecordQuery(baseOptions?: Apollo.QueryHookOptions<GetEmployeeListWithRecordQuery, GetEmployeeListWithRecordQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetEmployeeListWithRecordQuery, GetEmployeeListWithRecordQueryVariables>(GetEmployeeListWithRecordDocument, options);
}
export function useGetEmployeeListWithRecordLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEmployeeListWithRecordQuery, GetEmployeeListWithRecordQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetEmployeeListWithRecordQuery, GetEmployeeListWithRecordQueryVariables>(GetEmployeeListWithRecordDocument, options);
}
export type GetEmployeeListWithRecordQueryHookResult = ReturnType<typeof useGetEmployeeListWithRecordQuery>;
export type GetEmployeeListWithRecordLazyQueryHookResult = ReturnType<typeof useGetEmployeeListWithRecordLazyQuery>;
export type GetEmployeeListWithRecordQueryResult = Apollo.QueryResult<GetEmployeeListWithRecordQuery, GetEmployeeListWithRecordQueryVariables>;
export const GetEmployeeByIdDocument = gql`
  query getEmployeeById($id: String!) {
    employee(id: $id) {
      id
      name
      email
      rate
      status
      projects {
        id
        name
        description
        status
        isBillable
      }
    }
  }
`;

/**
 * __useGetEmployeeByIdQuery__
 *
 * To run a query within a React component, call `useGetEmployeeByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEmployeeByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEmployeeByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetEmployeeByIdQuery(baseOptions: Apollo.QueryHookOptions<GetEmployeeByIdQuery, GetEmployeeByIdQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetEmployeeByIdQuery, GetEmployeeByIdQueryVariables>(GetEmployeeByIdDocument, options);
}
export function useGetEmployeeByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEmployeeByIdQuery, GetEmployeeByIdQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetEmployeeByIdQuery, GetEmployeeByIdQueryVariables>(GetEmployeeByIdDocument, options);
}
export type GetEmployeeByIdQueryHookResult = ReturnType<typeof useGetEmployeeByIdQuery>;
export type GetEmployeeByIdLazyQueryHookResult = ReturnType<typeof useGetEmployeeByIdLazyQuery>;
export type GetEmployeeByIdQueryResult = Apollo.QueryResult<GetEmployeeByIdQuery, GetEmployeeByIdQueryVariables>;
export const GetRecordWithFavoriteProjectDocument = gql`
  query getRecordWithFavoriteProject($id: String!, $date: DateTime!) {
    employee(id: $id) {
      id
      name
      email
      rate
      status
      projects {
        id
        name
        description
        status
        isBillable
      }
      recordsWithFavoriteProjects(date: $date) {
        id
        name
        description
        status
        hours
        isFavorite
        previousWeek
      }
    }
  }
`;

/**
 * __useGetRecordWithFavoriteProjectQuery__
 *
 * To run a query within a React component, call `useGetRecordWithFavoriteProjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRecordWithFavoriteProjectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRecordWithFavoriteProjectQuery({
 *   variables: {
 *      id: // value for 'id'
 *      date: // value for 'date'
 *   },
 * });
 */
export function useGetRecordWithFavoriteProjectQuery(baseOptions: Apollo.QueryHookOptions<GetRecordWithFavoriteProjectQuery, GetRecordWithFavoriteProjectQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetRecordWithFavoriteProjectQuery, GetRecordWithFavoriteProjectQueryVariables>(GetRecordWithFavoriteProjectDocument, options);
}
export function useGetRecordWithFavoriteProjectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRecordWithFavoriteProjectQuery, GetRecordWithFavoriteProjectQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetRecordWithFavoriteProjectQuery, GetRecordWithFavoriteProjectQueryVariables>(GetRecordWithFavoriteProjectDocument, options);
}
export type GetRecordWithFavoriteProjectQueryHookResult = ReturnType<typeof useGetRecordWithFavoriteProjectQuery>;
export type GetRecordWithFavoriteProjectLazyQueryHookResult = ReturnType<typeof useGetRecordWithFavoriteProjectLazyQuery>;
export type GetRecordWithFavoriteProjectQueryResult = Apollo.QueryResult<GetRecordWithFavoriteProjectQuery, GetRecordWithFavoriteProjectQueryVariables>;
export const EmployeeCreateInputDocument = gql`
  mutation EmployeeCreateInput($newEmployee: EmployeeCreateInput!) {
    addEmployee(employee: $newEmployee) {
      id
      email
      name
      rate
    }
  }
`;
export type EmployeeCreateInputMutationFn = Apollo.MutationFunction<EmployeeCreateInputMutation, EmployeeCreateInputMutationVariables>;

/**
 * __useEmployeeCreateInputMutation__
 *
 * To run a mutation, you first call `useEmployeeCreateInputMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEmployeeCreateInputMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [employeeCreateInputMutation, { data, loading, error }] = useEmployeeCreateInputMutation({
 *   variables: {
 *      newEmployee: // value for 'newEmployee'
 *   },
 * });
 */
export function useEmployeeCreateInputMutation(baseOptions?: Apollo.MutationHookOptions<EmployeeCreateInputMutation, EmployeeCreateInputMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<EmployeeCreateInputMutation, EmployeeCreateInputMutationVariables>(EmployeeCreateInputDocument, options);
}
export type EmployeeCreateInputMutationHookResult = ReturnType<typeof useEmployeeCreateInputMutation>;
export type EmployeeCreateInputMutationResult = Apollo.MutationResult<EmployeeCreateInputMutation>;
export type EmployeeCreateInputMutationOptions = Apollo.BaseMutationOptions<EmployeeCreateInputMutation, EmployeeCreateInputMutationVariables>;
export const EmployeeUpdateInputDocument = gql`
  mutation EmployeeUpdateInput($updateEmployee: EmployeeUpdateInput!) {
    updateEmployee(updateEmployee: $updateEmployee) {
      id
      name
      email
      rate
      status
    }
  }
`;
export type EmployeeUpdateInputMutationFn = Apollo.MutationFunction<EmployeeUpdateInputMutation, EmployeeUpdateInputMutationVariables>;

/**
 * __useEmployeeUpdateInputMutation__
 *
 * To run a mutation, you first call `useEmployeeUpdateInputMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEmployeeUpdateInputMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [employeeUpdateInputMutation, { data, loading, error }] = useEmployeeUpdateInputMutation({
 *   variables: {
 *      updateEmployee: // value for 'updateEmployee'
 *   },
 * });
 */
export function useEmployeeUpdateInputMutation(baseOptions?: Apollo.MutationHookOptions<EmployeeUpdateInputMutation, EmployeeUpdateInputMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<EmployeeUpdateInputMutation, EmployeeUpdateInputMutationVariables>(EmployeeUpdateInputDocument, options);
}
export type EmployeeUpdateInputMutationHookResult = ReturnType<typeof useEmployeeUpdateInputMutation>;
export type EmployeeUpdateInputMutationResult = Apollo.MutationResult<EmployeeUpdateInputMutation>;
export type EmployeeUpdateInputMutationOptions = Apollo.BaseMutationOptions<EmployeeUpdateInputMutation, EmployeeUpdateInputMutationVariables>;
export const DeleteEmployeesDocument = gql`
  mutation DeleteEmployees($ids: [String!]!) {
    deleteEmployees(ids: $ids) {
      count
    }
  }
`;
export type DeleteEmployeesMutationFn = Apollo.MutationFunction<DeleteEmployeesMutation, DeleteEmployeesMutationVariables>;

/**
 * __useDeleteEmployeesMutation__
 *
 * To run a mutation, you first call `useDeleteEmployeesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEmployeesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEmployeesMutation, { data, loading, error }] = useDeleteEmployeesMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useDeleteEmployeesMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEmployeesMutation, DeleteEmployeesMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteEmployeesMutation, DeleteEmployeesMutationVariables>(DeleteEmployeesDocument, options);
}
export type DeleteEmployeesMutationHookResult = ReturnType<typeof useDeleteEmployeesMutation>;
export type DeleteEmployeesMutationResult = Apollo.MutationResult<DeleteEmployeesMutation>;
export type DeleteEmployeesMutationOptions = Apollo.BaseMutationOptions<DeleteEmployeesMutation, DeleteEmployeesMutationVariables>;
