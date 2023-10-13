/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type AddRecordMutationVariables = Types.Exact<{
  record: Types.RecordCreateInput;
}>;

export type AddRecordMutation = {
  __typename?: 'Mutation';
  insertOrUpdateRecord: { __typename?: 'RecordInsertOrUpdateModel'; employeeId: string; projectId: string; date: any; hours: number };
};

export type DeleteRecordMutationVariables = Types.Exact<{
  input: Types.RecordDeleteInput;
}>;

export type DeleteRecordMutation = { __typename?: 'Mutation'; deleteRecord: { __typename?: 'BatchPayload'; count: number } };

export type GetRecordsByDateRangeQueryVariables = Types.Exact<{
  input: Types.DateRangeInput;
}>;

export type GetRecordsByDateRangeQuery = {
  __typename?: 'Query';
  getRecordsByDateRange: Array<{
    __typename?: 'RecordModel';
    date: any;
    hours: number;
    employee: { __typename?: 'EmployeeModel'; name: string };
    project: { __typename?: 'ProjectModel'; name: string; rate: number; isBillable: boolean };
  }>;
};

export const AddRecordDocument = gql`
  mutation addRecord($record: RecordCreateInput!) {
    insertOrUpdateRecord(record: $record) {
      employeeId
      projectId
      date
      hours
    }
  }
`;
export type AddRecordMutationFn = Apollo.MutationFunction<AddRecordMutation, AddRecordMutationVariables>;

/**
 * __useAddRecordMutation__
 *
 * To run a mutation, you first call `useAddRecordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddRecordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addRecordMutation, { data, loading, error }] = useAddRecordMutation({
 *   variables: {
 *      record: // value for 'record'
 *   },
 * });
 */
export function useAddRecordMutation(baseOptions?: Apollo.MutationHookOptions<AddRecordMutation, AddRecordMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<AddRecordMutation, AddRecordMutationVariables>(AddRecordDocument, options);
}
export type AddRecordMutationHookResult = ReturnType<typeof useAddRecordMutation>;
export type AddRecordMutationResult = Apollo.MutationResult<AddRecordMutation>;
export type AddRecordMutationOptions = Apollo.BaseMutationOptions<AddRecordMutation, AddRecordMutationVariables>;
export const DeleteRecordDocument = gql`
  mutation deleteRecord($input: RecordDeleteInput!) {
    deleteRecord(input: $input) {
      count
    }
  }
`;
export type DeleteRecordMutationFn = Apollo.MutationFunction<DeleteRecordMutation, DeleteRecordMutationVariables>;

/**
 * __useDeleteRecordMutation__
 *
 * To run a mutation, you first call `useDeleteRecordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRecordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRecordMutation, { data, loading, error }] = useDeleteRecordMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteRecordMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRecordMutation, DeleteRecordMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteRecordMutation, DeleteRecordMutationVariables>(DeleteRecordDocument, options);
}
export type DeleteRecordMutationHookResult = ReturnType<typeof useDeleteRecordMutation>;
export type DeleteRecordMutationResult = Apollo.MutationResult<DeleteRecordMutation>;
export type DeleteRecordMutationOptions = Apollo.BaseMutationOptions<DeleteRecordMutation, DeleteRecordMutationVariables>;
export const GetRecordsByDateRangeDocument = gql`
  query getRecordsByDateRange($input: DateRangeInput!) {
    getRecordsByDateRange(input: $input) {
      date
      hours
      employee {
        name
      }
      project {
        name
        rate
        isBillable
      }
    }
  }
`;

/**
 * __useGetRecordsByDateRangeQuery__
 *
 * To run a query within a React component, call `useGetRecordsByDateRangeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRecordsByDateRangeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRecordsByDateRangeQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetRecordsByDateRangeQuery(baseOptions: Apollo.QueryHookOptions<GetRecordsByDateRangeQuery, GetRecordsByDateRangeQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetRecordsByDateRangeQuery, GetRecordsByDateRangeQueryVariables>(GetRecordsByDateRangeDocument, options);
}
export function useGetRecordsByDateRangeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRecordsByDateRangeQuery, GetRecordsByDateRangeQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetRecordsByDateRangeQuery, GetRecordsByDateRangeQueryVariables>(GetRecordsByDateRangeDocument, options);
}
export type GetRecordsByDateRangeQueryHookResult = ReturnType<typeof useGetRecordsByDateRangeQuery>;
export type GetRecordsByDateRangeLazyQueryHookResult = ReturnType<typeof useGetRecordsByDateRangeLazyQuery>;
export type GetRecordsByDateRangeQueryResult = Apollo.QueryResult<GetRecordsByDateRangeQuery, GetRecordsByDateRangeQueryVariables>;
