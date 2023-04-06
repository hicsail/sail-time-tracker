import { ObjectType, Field, ID } from '@nestjs/graphql';

/**
 * return types for querying employee
 */

@ObjectType()
export class RecordInsertOrUpdateModel {
  @Field(() => ID)
  employeeId: string;

  @Field(() => ID)
  projectId: string;

  @Field()
  date: Date;

  @Field()
  hours: number;
}
