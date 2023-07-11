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

export type DeleteInvoiceMutationVariables = Types.Exact<{
  projectId_startDate_endDate: Types.InvoiceSearchInput;
}>;

export type DeleteInvoiceMutation = { __typename?: 'Mutation'; deleteInvoice: { __typename?: 'InvoiceModel'; invoiceId: string } };

export type GetAllInvoicesQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetAllInvoicesQuery = {
  __typename?: 'Query';
  invoices: Array<{
    __typename?: 'InvoiceModelWithProject';
    invoiceId: string;
    startDate: any;
    endDate: any;
    hours: number;
    amount: number;
    project: { __typename?: 'ProjectModel'; id: string; name: string };
  }>;
};

export type SearchInvoiceQueryVariables = Types.Exact<{
  projectId_startDate_endDate: Types.InvoiceSearchInput;
}>;

export type SearchInvoiceQuery = {
  __typename?: 'Query';
  searchInvoice: {
    __typename?: 'InvoiceModelWithProjectAndComments';
    invoiceId: string;
    startDate: any;
    endDate: any;
    hours: number;
    amount: number;
    project: { __typename?: 'ProjectModel'; id: string; name: string };
    comments: Array<{ __typename?: 'CommentModel'; createDate: any; commentId: string; invoiceId: string; content: string }>;
  };
};

export type SearchInvoicesByDateRangeQueryVariables = Types.Exact<{
  startDate: Types.Scalars['DateTime'];
  endDate: Types.Scalars['DateTime'];
}>;

export type SearchInvoicesByDateRangeQuery = { __typename?: 'Query'; searchInvoicesByDateRange: Array<{ __typename?: 'InvoiceModel'; projectId: string }> };

export type FindPreviousInvoiceQueryVariables = Types.Exact<{
  projectId: Types.Scalars['String'];
  startDate: Types.Scalars['DateTime'];
}>;

export type FindPreviousInvoiceQuery = {
  __typename?: 'Query';
  findPreviousInvoice?: {
    __typename?: 'InvoiceModelWithProjectAndComments';
    invoiceId: string;
    startDate: any;
    endDate: any;
    hours: number;
    amount: number;
    project: { __typename?: 'ProjectModel'; id: string; name: string };
    comments: Array<{ __typename?: 'CommentModel'; createDate: any; commentId: string; invoiceId: string; content: string }>;
  } | null;
};

export type FindNextInvoiceQueryVariables = Types.Exact<{
  projectId: Types.Scalars['String'];
  endDate: Types.Scalars['DateTime'];
}>;

export type FindNextInvoiceQuery = {
  __typename?: 'Query';
  findNextInvoice?: {
    __typename?: 'InvoiceModelWithProjectAndComments';
    invoiceId: string;
    startDate: any;
    endDate: any;
    hours: number;
    amount: number;
    project: { __typename?: 'ProjectModel'; id: string; name: string };
    comments: Array<{ __typename?: 'CommentModel'; createDate: any; commentId: string; invoiceId: string; content: string }>;
  } | null;
};

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

export type CreateClickUpTaskMutation = { __typename?: 'Mutation'; createClickUpTask: boolean };

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
export const DeleteInvoiceDocument = gql`
  mutation deleteInvoice($projectId_startDate_endDate: InvoiceSearchInput!) {
    deleteInvoice(projectId_startDate_endDate: $projectId_startDate_endDate) {
      invoiceId
    }
  }
`;
export type DeleteInvoiceMutationFn = Apollo.MutationFunction<DeleteInvoiceMutation, DeleteInvoiceMutationVariables>;

/**
 * __useDeleteInvoiceMutation__
 *
 * To run a mutation, you first call `useDeleteInvoiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteInvoiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteInvoiceMutation, { data, loading, error }] = useDeleteInvoiceMutation({
 *   variables: {
 *      projectId_startDate_endDate: // value for 'projectId_startDate_endDate'
 *   },
 * });
 */
export function useDeleteInvoiceMutation(baseOptions?: Apollo.MutationHookOptions<DeleteInvoiceMutation, DeleteInvoiceMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteInvoiceMutation, DeleteInvoiceMutationVariables>(DeleteInvoiceDocument, options);
}
export type DeleteInvoiceMutationHookResult = ReturnType<typeof useDeleteInvoiceMutation>;
export type DeleteInvoiceMutationResult = Apollo.MutationResult<DeleteInvoiceMutation>;
export type DeleteInvoiceMutationOptions = Apollo.BaseMutationOptions<DeleteInvoiceMutation, DeleteInvoiceMutationVariables>;
export const GetAllInvoicesDocument = gql`
  query getAllInvoices {
    invoices {
      invoiceId
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
export const SearchInvoiceDocument = gql`
  query searchInvoice($projectId_startDate_endDate: InvoiceSearchInput!) {
    searchInvoice(projectId_startDate_endDate: $projectId_startDate_endDate) {
      invoiceId
      startDate
      endDate
      hours
      amount
      project {
        id
        name
      }
      comments {
        createDate
        commentId
        invoiceId
        content
      }
    }
  }
`;

/**
 * __useSearchInvoiceQuery__
 *
 * To run a query within a React component, call `useSearchInvoiceQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchInvoiceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchInvoiceQuery({
 *   variables: {
 *      projectId_startDate_endDate: // value for 'projectId_startDate_endDate'
 *   },
 * });
 */
export function useSearchInvoiceQuery(baseOptions: Apollo.QueryHookOptions<SearchInvoiceQuery, SearchInvoiceQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SearchInvoiceQuery, SearchInvoiceQueryVariables>(SearchInvoiceDocument, options);
}
export function useSearchInvoiceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchInvoiceQuery, SearchInvoiceQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SearchInvoiceQuery, SearchInvoiceQueryVariables>(SearchInvoiceDocument, options);
}
export type SearchInvoiceQueryHookResult = ReturnType<typeof useSearchInvoiceQuery>;
export type SearchInvoiceLazyQueryHookResult = ReturnType<typeof useSearchInvoiceLazyQuery>;
export type SearchInvoiceQueryResult = Apollo.QueryResult<SearchInvoiceQuery, SearchInvoiceQueryVariables>;
export const SearchInvoicesByDateRangeDocument = gql`
  query searchInvoicesByDateRange($startDate: DateTime!, $endDate: DateTime!) {
    searchInvoicesByDateRange(startDate: $startDate, endDate: $endDate) {
      projectId
    }
  }
`;

/**
 * __useSearchInvoicesByDateRangeQuery__
 *
 * To run a query within a React component, call `useSearchInvoicesByDateRangeQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchInvoicesByDateRangeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchInvoicesByDateRangeQuery({
 *   variables: {
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *   },
 * });
 */
export function useSearchInvoicesByDateRangeQuery(baseOptions: Apollo.QueryHookOptions<SearchInvoicesByDateRangeQuery, SearchInvoicesByDateRangeQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SearchInvoicesByDateRangeQuery, SearchInvoicesByDateRangeQueryVariables>(SearchInvoicesByDateRangeDocument, options);
}
export function useSearchInvoicesByDateRangeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchInvoicesByDateRangeQuery, SearchInvoicesByDateRangeQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SearchInvoicesByDateRangeQuery, SearchInvoicesByDateRangeQueryVariables>(SearchInvoicesByDateRangeDocument, options);
}
export type SearchInvoicesByDateRangeQueryHookResult = ReturnType<typeof useSearchInvoicesByDateRangeQuery>;
export type SearchInvoicesByDateRangeLazyQueryHookResult = ReturnType<typeof useSearchInvoicesByDateRangeLazyQuery>;
export type SearchInvoicesByDateRangeQueryResult = Apollo.QueryResult<SearchInvoicesByDateRangeQuery, SearchInvoicesByDateRangeQueryVariables>;
export const FindPreviousInvoiceDocument = gql`
  query findPreviousInvoice($projectId: String!, $startDate: DateTime!) {
    findPreviousInvoice(projectId: $projectId, startDate: $startDate) {
      invoiceId
      startDate
      endDate
      hours
      amount
      project {
        id
        name
      }
      comments {
        createDate
        commentId
        invoiceId
        content
      }
    }
  }
`;

/**
 * __useFindPreviousInvoiceQuery__
 *
 * To run a query within a React component, call `useFindPreviousInvoiceQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindPreviousInvoiceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindPreviousInvoiceQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      startDate: // value for 'startDate'
 *   },
 * });
 */
export function useFindPreviousInvoiceQuery(baseOptions: Apollo.QueryHookOptions<FindPreviousInvoiceQuery, FindPreviousInvoiceQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<FindPreviousInvoiceQuery, FindPreviousInvoiceQueryVariables>(FindPreviousInvoiceDocument, options);
}
export function useFindPreviousInvoiceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindPreviousInvoiceQuery, FindPreviousInvoiceQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<FindPreviousInvoiceQuery, FindPreviousInvoiceQueryVariables>(FindPreviousInvoiceDocument, options);
}
export type FindPreviousInvoiceQueryHookResult = ReturnType<typeof useFindPreviousInvoiceQuery>;
export type FindPreviousInvoiceLazyQueryHookResult = ReturnType<typeof useFindPreviousInvoiceLazyQuery>;
export type FindPreviousInvoiceQueryResult = Apollo.QueryResult<FindPreviousInvoiceQuery, FindPreviousInvoiceQueryVariables>;
export const FindNextInvoiceDocument = gql`
  query findNextInvoice($projectId: String!, $endDate: DateTime!) {
    findNextInvoice(projectId: $projectId, endDate: $endDate) {
      invoiceId
      startDate
      endDate
      hours
      amount
      project {
        id
        name
      }
      comments {
        createDate
        commentId
        invoiceId
        content
      }
    }
  }
`;

/**
 * __useFindNextInvoiceQuery__
 *
 * To run a query within a React component, call `useFindNextInvoiceQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindNextInvoiceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindNextInvoiceQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      endDate: // value for 'endDate'
 *   },
 * });
 */
export function useFindNextInvoiceQuery(baseOptions: Apollo.QueryHookOptions<FindNextInvoiceQuery, FindNextInvoiceQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<FindNextInvoiceQuery, FindNextInvoiceQueryVariables>(FindNextInvoiceDocument, options);
}
export function useFindNextInvoiceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindNextInvoiceQuery, FindNextInvoiceQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<FindNextInvoiceQuery, FindNextInvoiceQueryVariables>(FindNextInvoiceDocument, options);
}
export type FindNextInvoiceQueryHookResult = ReturnType<typeof useFindNextInvoiceQuery>;
export type FindNextInvoiceLazyQueryHookResult = ReturnType<typeof useFindNextInvoiceLazyQuery>;
export type FindNextInvoiceQueryResult = Apollo.QueryResult<FindNextInvoiceQuery, FindNextInvoiceQueryVariables>;
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
    createClickUpTask(task: $task)
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
