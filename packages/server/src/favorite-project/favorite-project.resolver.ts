import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FavoriteProjectService } from './favorite-project.service';
import { FavoriteProjectCreateInput } from './dto/favorite-project.dto';
import { BatchPayload } from './model/favorite-project.model';
import { EmployeeDeleteReturnModel } from '../employees/model/employee.model';

@Resolver()
export class FavoriteProjectResolver {
  constructor(private favoriteProjectService: FavoriteProjectService) {}

  @Mutation(() => BatchPayload)
  async addFavoriteProject(
    @Args({
      name: 'favoriteProject',
      type: () => [FavoriteProjectCreateInput]
    })
    favoriteProject: [FavoriteProjectCreateInput]
  ): Promise<BatchPayload> {
    return this.favoriteProjectService.addFavoriteProject(favoriteProject);
  }

  @Mutation(() => BatchPayload)
  async deleteFavoriteProjects(
    @Args('employeeId') employeeId: string,
    @Args({ name: 'projectIds', type: () => [String] }) projectIds: string[]
  ): Promise<EmployeeDeleteReturnModel> {
    return this.favoriteProjectService.deleteFavoriteProjects(employeeId, projectIds);
  }
}
