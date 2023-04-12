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

@ObjectType()
export class RecordIModel {
  @Field(() => ID)
  employeeId: string;

  @Field(() => ID)
  projectId: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  hours: number;
}
