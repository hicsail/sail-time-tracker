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
}

@ObjectType()
export class CountModel {
  @Field()
  count: number;
}
