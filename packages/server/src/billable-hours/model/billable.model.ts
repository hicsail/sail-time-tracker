import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BillableHoursModel {
  @Field(() => ID)
  id: string;

  @Field()
  projectId: string;

  @Field()
  employeeId: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  precalculatedHours: number;

  @Field()
  billableHours: number;
}
