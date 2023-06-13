import { InputType, Field, ID } from '@nestjs/graphql';
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
