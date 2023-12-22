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
  status: string;

  @Field()
  workHours: number;

  @Field()
  indirectHours: number;

  @Field()
  precalculatedHours: number;

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
  rate: number;

  @Field()
  fte: number;

  @Field()
  status: string;

  @Field()
  contractTypeId: number;

  @Field()
  isBillable: boolean;

  @Field()
  projectWorkHours: number;

  @Field()
  projectIndirectHours: number;

  @Field()
  projectPercentage: string;

  @Field(() => Number, { nullable: true })
  precalculatedHours?: number;

  @Field(() => Number, { nullable: true })
  billableHours?: number;
}

@ObjectType()
export class ProjectWithEmployeeRecords {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  isBillable: boolean;

  @Field()
  status: string;

  @Field()
  rate: number;

  @Field()
  fte: number;

  @Field()
  contractTypeId: number;

  @Field()
  workHours: number;

  @Field()
  indirectHours: number;

  @Field()
  billableHours: number;

  @Field()
  percentage: string;

  @Field(() => [ProjectWithEmployeeRecordsInner])
  inner: ProjectWithEmployeeRecordsInner[];
}

@ObjectType()
export class ProjectWithEmployeeRecordsInner {
  @Field()
  employeeId: string;

  @Field()
  employeeName: string;

  @Field()
  employeeBillableHours: number;

  @Field()
  employeeWorkHours: number;

  @Field()
  employeeIndirectHours: number;

  @Field()
  employeePercentage: string;
}

@ObjectType()
export class SlackModel {
  @Field()
  employeeId: string;

  @Field(() => ID)
  slackId: string;
}

@ObjectType()
export class BatchResponseModel {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field()
  count: number;
}
