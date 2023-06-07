import { ObjectType, Field, ID } from '@nestjs/graphql';

/**
 * return types for querying employee
 */

@ObjectType()
export class InvoiceModel {
  @Field()
  projectId: string;

  @Field()
  employeeId: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  rate: number;

  @Field()
  hours: number;

  @Field()
  amount: number;
}
