import { Args, Query, Resolver } from '@nestjs/graphql';
import { Burndown } from './model/burndown.model';

@Resolver(() => Burndown)
export class BurndownResolver {

  @Query(() => [Burndown])
  async getHoursBreakdownActual(@Args('start') start: Date, @Args('end') end: Date): Promise<Burndown[]> {

    return [];
  }
}
