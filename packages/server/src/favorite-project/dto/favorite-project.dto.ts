import { Field, InputType, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * input type for adding new favorite project
 */

@InputType()
export class FavoriteProjectCreateInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  employeeId: string;

  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  projectId: string;
}
