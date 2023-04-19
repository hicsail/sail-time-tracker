import { Field, InputType, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

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
  isBillable: boolean;
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
