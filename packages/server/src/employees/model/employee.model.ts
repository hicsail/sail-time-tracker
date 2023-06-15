import { ObjectType, Field, ID } from '@nestjs/graphql';

/**
 * return types for querying employee
 */

@ObjectType()
export class EmployeeModel {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  rate: number;

  @Field({ nullable: true })
  status?: string;
}

@ObjectType()
export class EmployeeDeleteReturnModel {
  @Field()
  count: number;
}

@ObjectType()
export class EmployeeWithRecord {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  workHours: number;

  @Field()
  indirectHours: number;

  @Field()
  billableHours: number;

  @Field(() => [EmployeeWithRecordInner])
  inner: EmployeeWithRecordInner[];
}

@ObjectType()
class EmployeeWithRecordInner {
  @Field()
  projectId: string;

  @Field()
  projectName: string;

  @Field()
  isBillable: boolean;

  @Field()
  projectWorkHours: number;

  @Field()
  projectIndirectHours: number;

  @Field()
  projectPercentage: string;
}
