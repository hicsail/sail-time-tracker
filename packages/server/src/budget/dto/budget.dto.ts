import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber, IsDate, IsOptional } from 'class-validator';

@InputType()
export class AddBudgetAdjustmentInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  projectId: string;

  @Field()
  @IsNotEmpty()
  @IsDate()
  date: Date;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  note?: string;
}
