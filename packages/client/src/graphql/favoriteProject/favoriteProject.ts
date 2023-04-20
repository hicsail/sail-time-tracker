/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';

const defaultOptions = {} as const;
export type AddFavoriteProjectMutationVariables = Types.Exact<{
  favoriteProject: Array<Types.FavoriteProjectCreateInput> | Types.FavoriteProjectCreateInput;
}>;

export type AddFavoriteProjectMutation = { __typename?: 'Mutation'; addFavoriteProject: { __typename?: 'BatchPayload'; count: number } };

export type DeleteFavoriteProjectMutationVariables = Types.Exact<{
  employeeId: Types.Scalars['String'];
  projectIds: Array<Types.Scalars['String']> | Types.Scalars['String'];
}>;

export type DeleteFavoriteProjectMutation = { __typename?: 'Mutation'; deleteFavoriteProjects: { __typename?: 'BatchPayload'; count: number } };

export const AddFavoriteProjectDocument = gql`
  mutation addFavoriteProject($favoriteProject: [FavoriteProjectCreateInput!]!) {
    addFavoriteProject(favoriteProject: $favoriteProject) {
      count
    }
  }
`;
export type AddFavoriteProjectMutationFn = Apollo.MutationFunction<AddFavoriteProjectMutation, AddFavoriteProjectMutationVariables>;

/**
 * __useAddFavoriteProjectMutation__
 *
 * To run a mutation, you first call `useAddFavoriteProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddFavoriteProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addFavoriteProjectMutation, { data, loading, error }] = useAddFavoriteProjectMutation({
 *   variables: {
 *      favoriteProject: // value for 'favoriteProject'
 *   },
 * });
 */
export function useAddFavoriteProjectMutation(baseOptions?: Apollo.MutationHookOptions<AddFavoriteProjectMutation, AddFavoriteProjectMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<AddFavoriteProjectMutation, AddFavoriteProjectMutationVariables>(AddFavoriteProjectDocument, options);
}

export type AddFavoriteProjectMutationHookResult = ReturnType<typeof useAddFavoriteProjectMutation>;
export type AddFavoriteProjectMutationResult = Apollo.MutationResult<AddFavoriteProjectMutation>;
export type AddFavoriteProjectMutationOptions = Apollo.BaseMutationOptions<AddFavoriteProjectMutation, AddFavoriteProjectMutationVariables>;
export const DeleteFavoriteProjectDocument = gql`
  mutation DeleteFavoriteProject($employeeId: String!, $projectIds: [String!]!) {
    deleteFavoriteProjects(employeeId: $employeeId, projectIds: $projectIds) {
      count
    }
  }
`;
export type DeleteFavoriteProjectMutationFn = Apollo.MutationFunction<DeleteFavoriteProjectMutation, DeleteFavoriteProjectMutationVariables>;

/**
 * __useDeleteFavoriteProjectMutation__
 *
 * To run a mutation, you first call `useDeleteFavoriteProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteFavoriteProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteFavoriteProjectMutation, { data, loading, error }] = useDeleteFavoriteProjectMutation({
 *   variables: {
 *      employeeId: // value for 'employeeId'
 *      projectIds: // value for 'projectIds'
 *   },
 * });
 */
export function useDeleteFavoriteProjectMutation(baseOptions?: Apollo.MutationHookOptions<DeleteFavoriteProjectMutation, DeleteFavoriteProjectMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteFavoriteProjectMutation, DeleteFavoriteProjectMutationVariables>(DeleteFavoriteProjectDocument, options);
}

export type DeleteFavoriteProjectMutationHookResult = ReturnType<typeof useDeleteFavoriteProjectMutation>;
export type DeleteFavoriteProjectMutationResult = Apollo.MutationResult<DeleteFavoriteProjectMutation>;
export type DeleteFavoriteProjectMutationOptions = Apollo.BaseMutationOptions<DeleteFavoriteProjectMutation, DeleteFavoriteProjectMutationVariables>;
