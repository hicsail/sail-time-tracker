import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class BillableHoursCreateInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  projectId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  employeeId: string;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  precalculatedHours: number;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  billableHours: number;

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
export class BillableHoursSearchInput {
  @Field()
  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @Field()
  @IsNotEmpty()
  @IsDate()
  endDate: Date;
}
