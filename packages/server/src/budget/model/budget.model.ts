import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class BudgetAdjustmentModel {
  @Field()
  id: string;

  @Field()
  projectId: string;

  @Field()
  date: Date;

  @Field(() => Float)
  amount: number;

  @Field({ nullable: true })
  note?: string;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class DailySpendRecord {
  @Field()
  date: Date;

  @Field(() => Float)
  hours: number;

  @Field(() => Float)
  cost: number;
}

@ObjectType()
export class InvoiceRecord {
  @Field()
  invoiceId: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field(() => Float)
  amount: number;
}

@ObjectType()
export class BurndownData {
  @Field()
  projectId: string;

  @Field()
  projectName: string;

  @Field(() => Float)
  projectRate: number;

  @Field(() => [BudgetAdjustmentModel])
  adjustments: BudgetAdjustmentModel[];

  @Field(() => [DailySpendRecord])
  dailyRecords: DailySpendRecord[];

  @Field(() => [InvoiceRecord])
  invoices: InvoiceRecord[];
}
