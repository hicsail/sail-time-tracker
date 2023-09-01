import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber, IsDate } from 'class-validator';

/**
 * input type for creating new invoice
 */

@InputType()
export class InvoiceCreateInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  projectId: string;

  @Field()
  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @Field()
  @IsNotEmpty()
  @IsDate()
  endDate: Date;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  rate: number;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  hours: number;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

@InputType()
export class InvoiceSearchInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  projectId: string;

  @Field()
  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @Field()
  @IsNotEmpty()
  @IsDate()
  endDate: Date;
}

@InputType()
export class InvoiceItemUpdateInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  invoiceId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  employeeId: string;

  @Field(() => Number, { nullable: true })
  workHours?: number;

  @Field(() => Number, { nullable: true })
  indirectHours?: number;
}
