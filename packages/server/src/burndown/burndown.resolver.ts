import { Args, Query, Resolver } from '@nestjs/graphql';
import { BurndownService } from './burndown.service';
import { Burndown } from './model/burndown.model';

@Resolver(() => Burndown)
export class BurndownResolver {
  constructor(private readonly burndownService: BurndownService) {}

  @Query(() => [Burndown])
  async getHoursBreakdownActual(): Promise<Burndown[]> {
    return this.burndownService.getRealBurndown();
  }
}
