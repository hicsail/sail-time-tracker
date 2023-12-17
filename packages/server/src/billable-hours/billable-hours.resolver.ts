import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { BillableHoursService } from './billable-hours.service';
import { BillableHoursModel } from './model/billable.model';
import { BillableHoursCreateInput } from './dto/billable.dto';

@Resolver()
export class BillableHoursResolver {
  constructor(private billableHoursService: BillableHoursService) {}

  @Mutation(() => BillableHoursModel)
  async createOrUpdateBillableHours(@Args('input') input: BillableHoursCreateInput): Promise<BillableHoursModel> {
    return this.billableHoursService.createOrUpdateBillableHours(input);
  }
}
