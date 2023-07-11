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
export class ClickUpTaskCreateInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  description: string;

  @Field()
  @IsNumber()
  status: number;

  @Field(() => [ClickUpTaskCustomFieldsInput])
  custom_fields: ClickUpTaskCustomFieldsInput[];
}

@InputType()
export class ClickUpTaskCustomFieldsInput {
  @Field()
  @IsString()
  id: string;

  @Field()
  value: string;
}
