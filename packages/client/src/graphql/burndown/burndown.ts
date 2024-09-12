/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetHoursBreakdownActualQueryVariables = Types.Exact<{
  projectId: Types.Scalars['String'];
}>;

export type GetHoursBreakdownActualQuery = { __typename?: 'Query'; getHoursBreakdownActual: Array<{ __typename?: 'Burndown'; startDate: any; endDate: any; hours: number }> };

export type GetHoursBreakdownEstimateQueryVariables = Types.Exact<{
  projectId: Types.Scalars['String'];
}>;

export type GetHoursBreakdownEstimateQuery = { __typename?: 'Query'; getHoursBreakdownEstimate: Array<{ __typename?: 'Burndown'; startDate: any; endDate: any; hours: number }> };

export const GetHoursBreakdownActualDocument = gql`
  query getHoursBreakdownActual($projectId: String!) {
    getHoursBreakdownActual(projectId: $projectId) {
      startDate
      endDate
      hours
    }
  }
`;

/**
 * __useGetHoursBreakdownActualQuery__
 *
 * To run a query within a React component, call `useGetHoursBreakdownActualQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetHoursBreakdownActualQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetHoursBreakdownActualQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useGetHoursBreakdownActualQuery(baseOptions: Apollo.QueryHookOptions<GetHoursBreakdownActualQuery, GetHoursBreakdownActualQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetHoursBreakdownActualQuery, GetHoursBreakdownActualQueryVariables>(GetHoursBreakdownActualDocument, options);
}
export function useGetHoursBreakdownActualLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetHoursBreakdownActualQuery, GetHoursBreakdownActualQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetHoursBreakdownActualQuery, GetHoursBreakdownActualQueryVariables>(GetHoursBreakdownActualDocument, options);
}
export type GetHoursBreakdownActualQueryHookResult = ReturnType<typeof useGetHoursBreakdownActualQuery>;
export type GetHoursBreakdownActualLazyQueryHookResult = ReturnType<typeof useGetHoursBreakdownActualLazyQuery>;
export type GetHoursBreakdownActualQueryResult = Apollo.QueryResult<GetHoursBreakdownActualQuery, GetHoursBreakdownActualQueryVariables>;
export const GetHoursBreakdownEstimateDocument = gql`
  query getHoursBreakdownEstimate($projectId: String!) {
    getHoursBreakdownEstimate(projectId: $projectId) {
      startDate
      endDate
      hours
    }
  }
`;

/**
 * __useGetHoursBreakdownEstimateQuery__
 *
 * To run a query within a React component, call `useGetHoursBreakdownEstimateQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetHoursBreakdownEstimateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetHoursBreakdownEstimateQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useGetHoursBreakdownEstimateQuery(baseOptions: Apollo.QueryHookOptions<GetHoursBreakdownEstimateQuery, GetHoursBreakdownEstimateQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetHoursBreakdownEstimateQuery, GetHoursBreakdownEstimateQueryVariables>(GetHoursBreakdownEstimateDocument, options);
}
export function useGetHoursBreakdownEstimateLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetHoursBreakdownEstimateQuery, GetHoursBreakdownEstimateQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetHoursBreakdownEstimateQuery, GetHoursBreakdownEstimateQueryVariables>(GetHoursBreakdownEstimateDocument, options);
}
export type GetHoursBreakdownEstimateQueryHookResult = ReturnType<typeof useGetHoursBreakdownEstimateQuery>;
export type GetHoursBreakdownEstimateLazyQueryHookResult = ReturnType<typeof useGetHoursBreakdownEstimateLazyQuery>;
export type GetHoursBreakdownEstimateQueryResult = Apollo.QueryResult<GetHoursBreakdownEstimateQuery, GetHoursBreakdownEstimateQueryVariables>;
