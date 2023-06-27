import { ObjectType, Field, ID } from '@nestjs/graphql';

/**
 * return types for querying employee
 */

@ObjectType()
export class RecordInsertOrUpdateModel {
  @Field(() => ID)
  employeeId: string;

  @Field(() => ID)
  projectId: string;

  @Field()
  date: Date;

  @Field()
  hours: number;
}

@ObjectType()
export class RecordWithFavoriteProjectModel {
  @Field(() => String, { nullable: true })
  date: string | null;

  @Field()
  hours: number;
}

@ObjectType()
export class GroupedRecordWithFavoriteProjectModel {
  @Field()
  projectId: string;

  @Field()
  projectName: string;

  @Field()
  description: string;

  @Field()
  isFavorite: boolean;

  @Field(() => [RecordWithFavoriteProjectModel])
  records: RecordWithFavoriteProjectModel[];
}
