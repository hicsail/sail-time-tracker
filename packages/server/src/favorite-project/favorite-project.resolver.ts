import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FavoriteProjectService } from './favorite-project.service';
import { FavoriteProjectCreateInput } from './dto/favorite-project.dto';
import { BatchPayload } from './model/favorite-project.model';

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
}
