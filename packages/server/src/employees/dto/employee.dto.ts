import { InputType, Field, ID } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

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

  @Field()
  @IsNotEmpty()
  @IsNumber()
  rate: number;

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
