/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateOrUpdateInvoiceMutationVariables = Types.Exact<{
  invoice: Types.InvoiceCreateInput;
}>;

export type CreateOrUpdateInvoiceMutation = { __typename?: 'Mutation'; createOrUpdateInvoice: { __typename?: 'InvoiceModel'; projectId: string; startDate: any; endDate: any } };

export type GetAllInvoicesQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetAllInvoicesQuery = {
  __typename?: 'Query';
  invoices: Array<{
    __typename?: 'InvoiceModelWithProject';
    startDate: any;
    endDate: any;
    hours: number;
    amount: number;
    project: { __typename?: 'ProjectModel'; id: string; name: string };
  }>;
};

export const CreateOrUpdateInvoiceDocument = gql`
  mutation createOrUpdateInvoice($invoice: InvoiceCreateInput!) {
    createOrUpdateInvoice(invoice: $invoice) {
      projectId
      startDate
      endDate
    }
  }
`;
export type CreateOrUpdateInvoiceMutationFn = Apollo.MutationFunction<CreateOrUpdateInvoiceMutation, CreateOrUpdateInvoiceMutationVariables>;

/**
 * __useCreateOrUpdateInvoiceMutation__
 *
 * To run a mutation, you first call `useCreateOrUpdateInvoiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOrUpdateInvoiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOrUpdateInvoiceMutation, { data, loading, error }] = useCreateOrUpdateInvoiceMutation({
 *   variables: {
 *      invoice: // value for 'invoice'
 *   },
 * });
 */
export function useCreateOrUpdateInvoiceMutation(baseOptions?: Apollo.MutationHookOptions<CreateOrUpdateInvoiceMutation, CreateOrUpdateInvoiceMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateOrUpdateInvoiceMutation, CreateOrUpdateInvoiceMutationVariables>(CreateOrUpdateInvoiceDocument, options);
}
export type CreateOrUpdateInvoiceMutationHookResult = ReturnType<typeof useCreateOrUpdateInvoiceMutation>;
export type CreateOrUpdateInvoiceMutationResult = Apollo.MutationResult<CreateOrUpdateInvoiceMutation>;
export type CreateOrUpdateInvoiceMutationOptions = Apollo.BaseMutationOptions<CreateOrUpdateInvoiceMutation, CreateOrUpdateInvoiceMutationVariables>;
export const GetAllInvoicesDocument = gql`
  query getAllInvoices {
    invoices {
      startDate
      endDate
      hours
      amount
      project {
        id
        name
      }
    }
  }
`;

/**
 * __useGetAllInvoicesQuery__
 *
 * To run a query within a React component, call `useGetAllInvoicesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllInvoicesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllInvoicesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllInvoicesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllInvoicesQuery, GetAllInvoicesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetAllInvoicesQuery, GetAllInvoicesQueryVariables>(GetAllInvoicesDocument, options);
}
export function useGetAllInvoicesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllInvoicesQuery, GetAllInvoicesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetAllInvoicesQuery, GetAllInvoicesQueryVariables>(GetAllInvoicesDocument, options);
}
export type GetAllInvoicesQueryHookResult = ReturnType<typeof useGetAllInvoicesQuery>;
export type GetAllInvoicesLazyQueryHookResult = ReturnType<typeof useGetAllInvoicesLazyQuery>;
export type GetAllInvoicesQueryResult = Apollo.QueryResult<GetAllInvoicesQuery, GetAllInvoicesQueryVariables>;