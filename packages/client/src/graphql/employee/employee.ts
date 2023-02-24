/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetEmployeeListQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetEmployeeListQuery = { __typename?: 'Query'; employees: Array<{ __typename?: 'EmployeeModel'; id: string; email: string; name: string }> };

export const GetEmployeeListDocument = gql`
  query getEmployeeList {
    employees {
      id
      email
      name
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
