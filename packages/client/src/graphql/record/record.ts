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
