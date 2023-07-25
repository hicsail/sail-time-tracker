import { InputType, Field, ID } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, IsOptional, ArrayNotEmpty } from 'class-validator';

/**
 * input type for adding new employee
 */

@InputType()
export class EmployeeCreateInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  status: string | null;
}

/**
 * input type for updating new employee
 */

@InputType()
export class EmployeeUpdateInput extends EmployeeCreateInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id: string;
}

@InputType()
export class SlackEmployeeInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  slackId: string;
}

@InputType()
export class SendSlackMessageInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  message: string;
}

@InputType()
export class BatchSendSlackMessageInput {
  @Field(() => [String])
  @ArrayNotEmpty()
  @IsString({ each: true })
  employeeIds: string[];

  @Field()
  @IsString()
  @IsNotEmpty()
  message: string;
}
