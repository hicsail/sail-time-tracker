import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BudgetService } from './budget.service';
import { BudgetAdjustmentModel, BurndownData } from './model/budget.model';
import { AddBudgetAdjustmentInput } from './dto/budget.dto';

@Resolver()
export class BudgetResolver {
  constructor(private budgetService: BudgetService) {}

  @Query(() => [BudgetAdjustmentModel])
  async getProjectAdjustments(@Args('projectId') projectId: string): Promise<BudgetAdjustmentModel[]> {
    return this.budgetService.getProjectAdjustments(projectId);
  }

  @Query(() => BurndownData)
  async getBurndownData(@Args('projectId') projectId: string, @Args('startDate') startDate: Date, @Args('endDate') endDate: Date): Promise<BurndownData> {
    return this.budgetService.getBurndownData(projectId, startDate, endDate);
  }

  @Mutation(() => BudgetAdjustmentModel)
  async addBudgetAdjustment(@Args('input') input: AddBudgetAdjustmentInput): Promise<BudgetAdjustmentModel> {
    return this.budgetService.addBudgetAdjustment(input);
  }

  @Mutation(() => BudgetAdjustmentModel)
  async deleteBudgetAdjustment(@Args('id') id: string): Promise<BudgetAdjustmentModel> {
    return this.budgetService.deleteBudgetAdjustment(id);
  }
}
