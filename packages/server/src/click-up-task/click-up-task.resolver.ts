import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ClickUpTaskService } from './click-up-task.service';
import { ClickUpStatuses, ClickUpTaskModel, ListCustomField } from './model/task.model';
import { ClickUpTaskCreateInput, ClickUpTaskInput } from './dto/task.dto';

@Resolver()
export class ClickUpTaskResolver {
  constructor(private clickUpTaskService: ClickUpTaskService) {}

  @Query(() => [ListCustomField])
  async getClickUpCustomFields(): Promise<ListCustomField[]> {
    return this.clickUpTaskService.getClickUpCustomFields();
  }

  @Query(() => [ClickUpStatuses])
  async getClickUpStatuses(): Promise<ClickUpStatuses[]> {
    return this.clickUpTaskService.getClickUpStatuses();
  }

  @Mutation(() => ClickUpTaskModel)
  async createClickUpTask(@Args('task') task: ClickUpTaskCreateInput): Promise<ClickUpTaskModel> {
    return this.clickUpTaskService.createClickUpTask(task);
  }

  @Query(() => Boolean)
  async getClickUpTask(@Args('taskId') taskId: string): Promise<boolean> {
    return this.clickUpTaskService.getClickUpTask(taskId);
  }

  @Mutation(() => ClickUpTaskModel)
  async createAndAddClickUpTaskToInvoice(@Args('invoiceId') invoiceId: string, @Args('task') task: ClickUpTaskInput): Promise<ClickUpTaskModel> {
    return this.clickUpTaskService.createAndAddClickUpTaskToInvoice(invoiceId, task);
  }
}
