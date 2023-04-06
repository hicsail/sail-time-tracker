import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RecordCreateInput } from './dto/record.dto';
import { RecordInsertOrUpdateModel } from './model/record.model';
import { RecordService } from './record.service';

@Resolver(() => RecordInsertOrUpdateModel)
export class RecordResolver {
  constructor(private recordService: RecordService) {}

  @Mutation(() => RecordInsertOrUpdateModel)
  async insertOrUpdateRecord(@Args('record') record: RecordCreateInput): Promise<RecordInsertOrUpdateModel> {
    return this.recordService.insertOrUpdateRecord(record);
  }
}
