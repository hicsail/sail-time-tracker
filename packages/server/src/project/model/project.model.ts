import { ObjectType, Field, ID } from '@nestjs/graphql';

/**
 * return types for querying project
 */

@ObjectType()
export class ProjectModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  status: string;

  @Field()
  description: string;

  @Field()
  isBillable: boolean;

  @Field()
  rate: number;
}

@ObjectType()
export class ProjectDeleteReturnModel {
  @Field()
  count: number;
}
