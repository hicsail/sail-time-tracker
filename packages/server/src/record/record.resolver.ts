import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RecordCreateInput, RecordDeleteInput } from './dto/record.dto';
import { RecordInsertOrUpdateModel } from './model/record.model';
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
}
