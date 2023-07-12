/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetClickUpCustomFieldsQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetClickUpCustomFieldsQuery = {
  __typename?: 'Query';
  getClickUpCustomFields: Array<{
    __typename?: 'ListCustomField';
    id: string;
    name: string;
    type: string;
    required?: boolean | null;
    type_config: {
      __typename?: 'ListCustomFieldTypeConfig';
      options?: Array<{ __typename?: 'ListCustomFieldTypeConfigOptions'; id: string; name?: string | null; orderindex?: number | null; label?: string | null }> | null;
    };
  }>;
};

export type GetClickUpStatusesQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetClickUpStatusesQuery = { __typename?: 'Query'; getClickUpStatuses: Array<{ __typename?: 'ClickUpStatuses'; id: string; status: string; orderindex: number }> };

export type CreateClickUpTaskMutationVariables = Types.Exact<{
  task: Types.ClickUpTaskCreateInput;
}>;

export type CreateClickUpTaskMutation = { __typename?: 'Mutation'; createClickUpTask: { __typename?: 'ClickUpTaskModel'; url: string; id: string } };

export type CreateAndAddClickUpTaskToInvoiceMutationVariables = Types.Exact<{
  invoiceId: Types.Scalars['String'];
  task: Types.ClickUpTaskInput;
}>;

export type CreateAndAddClickUpTaskToInvoiceMutation = { __typename?: 'Mutation'; createAndAddClickUpTaskToInvoice: { __typename?: 'ClickUpTaskModel'; id: string; url: string } };

export const GetClickUpCustomFieldsDocument = gql`
  query getClickUpCustomFields {
    getClickUpCustomFields {
      id
      name
      type
      required
      type_config {
        options {
          id
          name
          orderindex
          label
        }
      }
    }
  }
`;

/**
 * __useGetClickUpCustomFieldsQuery__
 *
 * To run a query within a React component, call `useGetClickUpCustomFieldsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClickUpCustomFieldsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClickUpCustomFieldsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetClickUpCustomFieldsQuery(baseOptions?: Apollo.QueryHookOptions<GetClickUpCustomFieldsQuery, GetClickUpCustomFieldsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetClickUpCustomFieldsQuery, GetClickUpCustomFieldsQueryVariables>(GetClickUpCustomFieldsDocument, options);
}
export function useGetClickUpCustomFieldsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetClickUpCustomFieldsQuery, GetClickUpCustomFieldsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetClickUpCustomFieldsQuery, GetClickUpCustomFieldsQueryVariables>(GetClickUpCustomFieldsDocument, options);
}
export type GetClickUpCustomFieldsQueryHookResult = ReturnType<typeof useGetClickUpCustomFieldsQuery>;
export type GetClickUpCustomFieldsLazyQueryHookResult = ReturnType<typeof useGetClickUpCustomFieldsLazyQuery>;
export type GetClickUpCustomFieldsQueryResult = Apollo.QueryResult<GetClickUpCustomFieldsQuery, GetClickUpCustomFieldsQueryVariables>;
export const GetClickUpStatusesDocument = gql`
  query getClickUpStatuses {
    getClickUpStatuses {
      id
      status
      orderindex
    }
  }
`;

/**
 * __useGetClickUpStatusesQuery__
 *
 * To run a query within a React component, call `useGetClickUpStatusesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClickUpStatusesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClickUpStatusesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetClickUpStatusesQuery(baseOptions?: Apollo.QueryHookOptions<GetClickUpStatusesQuery, GetClickUpStatusesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetClickUpStatusesQuery, GetClickUpStatusesQueryVariables>(GetClickUpStatusesDocument, options);
}
export function useGetClickUpStatusesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetClickUpStatusesQuery, GetClickUpStatusesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetClickUpStatusesQuery, GetClickUpStatusesQueryVariables>(GetClickUpStatusesDocument, options);
}
export type GetClickUpStatusesQueryHookResult = ReturnType<typeof useGetClickUpStatusesQuery>;
export type GetClickUpStatusesLazyQueryHookResult = ReturnType<typeof useGetClickUpStatusesLazyQuery>;
export type GetClickUpStatusesQueryResult = Apollo.QueryResult<GetClickUpStatusesQuery, GetClickUpStatusesQueryVariables>;
export const CreateClickUpTaskDocument = gql`
  mutation createClickUpTask($task: ClickUpTaskCreateInput!) {
    createClickUpTask(task: $task) {
      url
      id
    }
  }
`;
export type CreateClickUpTaskMutationFn = Apollo.MutationFunction<CreateClickUpTaskMutation, CreateClickUpTaskMutationVariables>;

/**
 * __useCreateClickUpTaskMutation__
 *
 * To run a mutation, you first call `useCreateClickUpTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateClickUpTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createClickUpTaskMutation, { data, loading, error }] = useCreateClickUpTaskMutation({
 *   variables: {
 *      task: // value for 'task'
 *   },
 * });
 */
export function useCreateClickUpTaskMutation(baseOptions?: Apollo.MutationHookOptions<CreateClickUpTaskMutation, CreateClickUpTaskMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateClickUpTaskMutation, CreateClickUpTaskMutationVariables>(CreateClickUpTaskDocument, options);
}
export type CreateClickUpTaskMutationHookResult = ReturnType<typeof useCreateClickUpTaskMutation>;
export type CreateClickUpTaskMutationResult = Apollo.MutationResult<CreateClickUpTaskMutation>;
export type CreateClickUpTaskMutationOptions = Apollo.BaseMutationOptions<CreateClickUpTaskMutation, CreateClickUpTaskMutationVariables>;
export const CreateAndAddClickUpTaskToInvoiceDocument = gql`
  mutation createAndAddClickUpTaskToInvoice($invoiceId: String!, $task: ClickUpTaskInput!) {
    createAndAddClickUpTaskToInvoice(invoiceId: $invoiceId, task: $task) {
      id
      url
    }
  }
`;
export type CreateAndAddClickUpTaskToInvoiceMutationFn = Apollo.MutationFunction<CreateAndAddClickUpTaskToInvoiceMutation, CreateAndAddClickUpTaskToInvoiceMutationVariables>;

/**
 * __useCreateAndAddClickUpTaskToInvoiceMutation__
 *
 * To run a mutation, you first call `useCreateAndAddClickUpTaskToInvoiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAndAddClickUpTaskToInvoiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAndAddClickUpTaskToInvoiceMutation, { data, loading, error }] = useCreateAndAddClickUpTaskToInvoiceMutation({
 *   variables: {
 *      invoiceId: // value for 'invoiceId'
 *      task: // value for 'task'
 *   },
 * });
 */
export function useCreateAndAddClickUpTaskToInvoiceMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateAndAddClickUpTaskToInvoiceMutation, CreateAndAddClickUpTaskToInvoiceMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateAndAddClickUpTaskToInvoiceMutation, CreateAndAddClickUpTaskToInvoiceMutationVariables>(CreateAndAddClickUpTaskToInvoiceDocument, options);
}
export type CreateAndAddClickUpTaskToInvoiceMutationHookResult = ReturnType<typeof useCreateAndAddClickUpTaskToInvoiceMutation>;
export type CreateAndAddClickUpTaskToInvoiceMutationResult = Apollo.MutationResult<CreateAndAddClickUpTaskToInvoiceMutation>;
export type CreateAndAddClickUpTaskToInvoiceMutationOptions = Apollo.BaseMutationOptions<
  CreateAndAddClickUpTaskToInvoiceMutation,
  CreateAndAddClickUpTaskToInvoiceMutationVariables
>;
