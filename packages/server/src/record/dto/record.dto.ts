import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsDate, IsNumber, IsString } from 'class-validator';

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
