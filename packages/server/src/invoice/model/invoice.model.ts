import { ObjectType, Field } from '@nestjs/graphql';

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

@ObjectType()
export class InvoiceSummaryModel {
  @Field()
  projectId: string;

  @Field()
  projectName: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  hours: number;

  @Field()
  amount: number;
}
