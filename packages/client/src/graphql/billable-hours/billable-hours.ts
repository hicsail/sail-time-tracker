/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateOrUpdateBillableHoursMutationVariables = Types.Exact<{
  input: Types.BillableHoursCreateInput;
}>;

export type CreateOrUpdateBillableHoursMutation = {
  __typename?: 'Mutation';
  createOrUpdateBillableHours: {
    __typename?: 'BillableHoursModel';
    id: string;
    employeeId: string;
    projectId: string;
    precalculatedHours: number;
    billableHours: number;
    startDate: any;
    endDate: any;
  };
};

export const CreateOrUpdateBillableHoursDocument = gql`
  mutation createOrUpdateBillableHours($input: BillableHoursCreateInput!) {
    createOrUpdateBillableHours(input: $input) {
      id
      employeeId
      projectId
      precalculatedHours
      billableHours
      startDate
      endDate
    }
  }
`;
export type CreateOrUpdateBillableHoursMutationFn = Apollo.MutationFunction<CreateOrUpdateBillableHoursMutation, CreateOrUpdateBillableHoursMutationVariables>;

/**
 * __useCreateOrUpdateBillableHoursMutation__
 *
 * To run a mutation, you first call `useCreateOrUpdateBillableHoursMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOrUpdateBillableHoursMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOrUpdateBillableHoursMutation, { data, loading, error }] = useCreateOrUpdateBillableHoursMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateOrUpdateBillableHoursMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateOrUpdateBillableHoursMutation, CreateOrUpdateBillableHoursMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateOrUpdateBillableHoursMutation, CreateOrUpdateBillableHoursMutationVariables>(CreateOrUpdateBillableHoursDocument, options);
}
export type CreateOrUpdateBillableHoursMutationHookResult = ReturnType<typeof useCreateOrUpdateBillableHoursMutation>;
export type CreateOrUpdateBillableHoursMutationResult = Apollo.MutationResult<CreateOrUpdateBillableHoursMutation>;
export type CreateOrUpdateBillableHoursMutationOptions = Apollo.BaseMutationOptions<CreateOrUpdateBillableHoursMutation, CreateOrUpdateBillableHoursMutationVariables>;
