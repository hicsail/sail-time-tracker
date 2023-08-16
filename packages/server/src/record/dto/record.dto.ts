import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsDate, IsNumber, IsString, ArrayNotEmpty } from 'class-validator';

@InputType()
export class RecordDeleteInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @Field(() => [String])
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty()
  projectIds: string[];

  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsNotEmpty()
  endDate: Date;
}

@InputType()
export class RecordCreateInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  hours: number;

  @Field()
  @IsDate()
  @IsNotEmpty()
  date: Date;
}
