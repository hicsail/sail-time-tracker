/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetProjectListQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetProjectListQuery = { __typename?: 'Query'; projects: Array<{ __typename?: 'ProjectModel'; id: string; name: string; description: string; status: string }> };

export type ProjectCreateInputMutationVariables = Types.Exact<{
  newProject: Types.ProjectCreateInput;
}>;

export type ProjectCreateInputMutation = { __typename?: 'Mutation'; addProject: { __typename?: 'ProjectModel'; id: string; name: string; description: string; status: string } };

export type ProjectUpdateInputMutationVariables = Types.Exact<{
  updateProject: Types.ProjectUpdateInput;
}>;

export type ProjectUpdateInputMutation = { __typename?: 'Mutation'; updateProject: { __typename?: 'ProjectModel'; id: string; name: string; description: string; status: string } };

export const GetProjectListDocument = gql`
  query getProjectList {
    projects {
      id
      name
      description
      status
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
export const ProjectCreateInputDocument = gql`
  mutation ProjectCreateInput($newProject: ProjectCreateInput!) {
    addProject(project: $newProject) {
      id
      name
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
      description
      status
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
