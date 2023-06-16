import { ObjectType, Field, ID } from '@nestjs/graphql';

/**
 * return types for querying project
 */

@ObjectType()
export class ProjectModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  status: string;

  @Field()
  description: string;

  @Field()
  isBillable: boolean;

  @Field()
  rate: number;
}

@ObjectType()
export class ProjectDeleteReturnModel {
  @Field()
  count: number;
}

@ObjectType()
export class ProjectWithRecord {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  isBillable: boolean;

  @Field()
  rate: number;

  @Field()
  workHours: number;

  @Field()
  indirectHours: number;

  @Field()
  percentage: string;

  @Field()
  billableHours: number;

  @Field(() => [ProjectWithRecordInner])
  inner: ProjectWithRecordInner[];
}

@ObjectType()
class ProjectWithRecordInner {
  @Field()
  employeeId: string;

  @Field()
  employeeName: string;

  @Field()
  employeeWorkHours: number;

  @Field()
  employeeIndirectHours: number;

  @Field()
  employeePercentage: string;
}
