/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetProjectListQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetProjectListQuery = {
  __typename?: 'Query';
  projects: Array<{
    __typename?: 'ProjectWithContractType';
    id: string;
    name: string;
    rate: number;
    fte: number;
    description: string;
    status: string;
    isBillable: boolean;
    contractType: { __typename?: 'ContractTypeModel'; id: number; name: string };
  }>;
};

export type GetProjectByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;

export type GetProjectByIdQuery = {
  __typename?: 'Query';
  project: {
    __typename?: 'ProjectWithContractType';
    id: string;
    name: string;
    description: string;
    rate: number;
    fte: number;
    status: string;
    isBillable: boolean;
    contractType: { __typename?: 'ContractTypeModel'; id: number; name: string };
  };
};

export type ProjectCreateInputMutationVariables = Types.Exact<{
  newProject: Types.ProjectCreateInput;
}>;

export type ProjectCreateInputMutation = {
  __typename?: 'Mutation';
  addProject: { __typename?: 'ProjectModel'; id: string; name: string; rate: number; fte: number; description: string; status: string };
};

export type ProjectUpdateInputMutationVariables = Types.Exact<{
  updateProject: Types.ProjectUpdateInput;
}>;

export type ProjectUpdateInputMutation = {
  __typename?: 'Mutation';
  updateProject: {
    __typename?: 'ProjectWithContractType';
    id: string;
    name: string;
    rate: number;
    fte: number;
    description: string;
    status: string;
    contractType: { __typename?: 'ContractTypeModel'; id: number; name: string };
  };
};

export type DeleteProjectsMutationVariables = Types.Exact<{
  ids: Array<Types.Scalars['String']> | Types.Scalars['String'];
}>;

export type DeleteProjectsMutation = { __typename?: 'Mutation'; deleteProjects: { __typename?: 'ProjectDeleteReturnModel'; count: number } };

export const GetProjectListDocument = gql`
  query getProjectList {
    projects {
      id
      name
      rate
      fte
      description
      status
      isBillable
      contractType {
        id
        name
      }
    }
  }
`;

/**
 * __useGetProjectListQuery__
 *
 * To run a query within a React component, call `useGetProjectListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectListQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetProjectListQuery(baseOptions?: Apollo.QueryHookOptions<GetProjectListQuery, GetProjectListQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetProjectListQuery, GetProjectListQueryVariables>(GetProjectListDocument, options);
}
export function useGetProjectListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProjectListQuery, GetProjectListQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetProjectListQuery, GetProjectListQueryVariables>(GetProjectListDocument, options);
}
export type GetProjectListQueryHookResult = ReturnType<typeof useGetProjectListQuery>;
export type GetProjectListLazyQueryHookResult = ReturnType<typeof useGetProjectListLazyQuery>;
export type GetProjectListQueryResult = Apollo.QueryResult<GetProjectListQuery, GetProjectListQueryVariables>;
export const GetProjectByIdDocument = gql`
  query getProjectById($id: String!) {
    project(id: $id) {
      id
      name
      description
      rate
      fte
      status
      isBillable
      contractType {
        id
        name
      }
    }
  }
`;

/**
 * __useGetProjectByIdQuery__
 *
 * To run a query within a React component, call `useGetProjectByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProjectByIdQuery(baseOptions: Apollo.QueryHookOptions<GetProjectByIdQuery, GetProjectByIdQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetProjectByIdQuery, GetProjectByIdQueryVariables>(GetProjectByIdDocument, options);
}
export function useGetProjectByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProjectByIdQuery, GetProjectByIdQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetProjectByIdQuery, GetProjectByIdQueryVariables>(GetProjectByIdDocument, options);
}
export type GetProjectByIdQueryHookResult = ReturnType<typeof useGetProjectByIdQuery>;
export type GetProjectByIdLazyQueryHookResult = ReturnType<typeof useGetProjectByIdLazyQuery>;
export type GetProjectByIdQueryResult = Apollo.QueryResult<GetProjectByIdQuery, GetProjectByIdQueryVariables>;
export const ProjectCreateInputDocument = gql`
  mutation ProjectCreateInput($newProject: ProjectCreateInput!) {
    addProject(project: $newProject) {
      id
      name
      rate
      fte
      description
      status
    }
  }
`;
export type ProjectCreateInputMutationFn = Apollo.MutationFunction<ProjectCreateInputMutation, ProjectCreateInputMutationVariables>;

/**
 * __useProjectCreateInputMutation__
 *
 * To run a mutation, you first call `useProjectCreateInputMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProjectCreateInputMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [projectCreateInputMutation, { data, loading, error }] = useProjectCreateInputMutation({
 *   variables: {
 *      newProject: // value for 'newProject'
 *   },
 * });
 */
export function useProjectCreateInputMutation(baseOptions?: Apollo.MutationHookOptions<ProjectCreateInputMutation, ProjectCreateInputMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<ProjectCreateInputMutation, ProjectCreateInputMutationVariables>(ProjectCreateInputDocument, options);
}
export type ProjectCreateInputMutationHookResult = ReturnType<typeof useProjectCreateInputMutation>;
export type ProjectCreateInputMutationResult = Apollo.MutationResult<ProjectCreateInputMutation>;
export type ProjectCreateInputMutationOptions = Apollo.BaseMutationOptions<ProjectCreateInputMutation, ProjectCreateInputMutationVariables>;
export const ProjectUpdateInputDocument = gql`
  mutation ProjectUpdateInput($updateProject: ProjectUpdateInput!) {
    updateProject(updateProject: $updateProject) {
      id
      name
      rate
      fte
      description
      status
      contractType {
        id
        name
      }
    }
  }
`;
export type ProjectUpdateInputMutationFn = Apollo.MutationFunction<ProjectUpdateInputMutation, ProjectUpdateInputMutationVariables>;

/**
 * __useProjectUpdateInputMutation__
 *
 * To run a mutation, you first call `useProjectUpdateInputMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProjectUpdateInputMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [projectUpdateInputMutation, { data, loading, error }] = useProjectUpdateInputMutation({
 *   variables: {
 *      updateProject: // value for 'updateProject'
 *   },
 * });
 */
export function useProjectUpdateInputMutation(baseOptions?: Apollo.MutationHookOptions<ProjectUpdateInputMutation, ProjectUpdateInputMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<ProjectUpdateInputMutation, ProjectUpdateInputMutationVariables>(ProjectUpdateInputDocument, options);
}
export type ProjectUpdateInputMutationHookResult = ReturnType<typeof useProjectUpdateInputMutation>;
export type ProjectUpdateInputMutationResult = Apollo.MutationResult<ProjectUpdateInputMutation>;
export type ProjectUpdateInputMutationOptions = Apollo.BaseMutationOptions<ProjectUpdateInputMutation, ProjectUpdateInputMutationVariables>;
export const DeleteProjectsDocument = gql`
  mutation DeleteProjects($ids: [String!]!) {
    deleteProjects(ids: $ids) {
      count
    }
  }
`;
export type DeleteProjectsMutationFn = Apollo.MutationFunction<DeleteProjectsMutation, DeleteProjectsMutationVariables>;

/**
 * __useDeleteProjectsMutation__
 *
 * To run a mutation, you first call `useDeleteProjectsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProjectsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProjectsMutation, { data, loading, error }] = useDeleteProjectsMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useDeleteProjectsMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProjectsMutation, DeleteProjectsMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteProjectsMutation, DeleteProjectsMutationVariables>(DeleteProjectsDocument, options);
}
export type DeleteProjectsMutationHookResult = ReturnType<typeof useDeleteProjectsMutation>;
export type DeleteProjectsMutationResult = Apollo.MutationResult<DeleteProjectsMutation>;
export type DeleteProjectsMutationOptions = Apollo.BaseMutationOptions<DeleteProjectsMutation, DeleteProjectsMutationVariables>;
