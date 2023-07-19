import { Field, InputType, ID } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

/**
 * input type for adding new project
 */

@InputType()
export class ProjectCreateInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  status: string;

  @Field()
  @IsNotEmpty()
  description: string;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  isBillable: boolean;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  fte: number;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  rate: number;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  contractTypeId: number;
}

/**
 * input type for updating new project
 */
@InputType()
export class ProjectUpdateInput extends ProjectCreateInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  id: string;
}
