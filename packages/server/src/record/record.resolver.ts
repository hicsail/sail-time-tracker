import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DateRangeInput, RecordCreateInput, RecordDeleteInput } from './dto/record.dto';
import { RecordInsertOrUpdateModel, RecordModel } from './model/record.model';
import { RecordService } from './record.service';
import { BatchPayload } from '../favorite-project/model/favorite-project.model';

@Resolver(() => RecordInsertOrUpdateModel)
export class RecordResolver {
  constructor(private recordService: RecordService) {}

  @Mutation(() => RecordInsertOrUpdateModel)
  async insertOrUpdateRecord(@Args('record') record: RecordCreateInput): Promise<RecordInsertOrUpdateModel> {
    return this.recordService.insertOrUpdateRecord(record);
  }

  @Mutation(() => BatchPayload)
  async deleteRecord(@Args('input') input: RecordDeleteInput): Promise<BatchPayload> {
    const { employeeId, projectIds, startDate, endDate } = input;
    return this.recordService.deleteZeroHoursRecord(employeeId, projectIds, startDate, endDate);
  }

  @Query(() => [RecordModel])
  async getRecordsByDateRange(@Args('input') dateRange: DateRangeInput): Promise<RecordModel[]> {
    const { startDate, endDate } = dateRange;
    return this.recordService.getRecordsByDateRange(startDate, endDate);
  }
}
