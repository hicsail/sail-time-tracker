import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ProjectModel } from '../../project/model/project.model';

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
export class RecordModel {
  @Field(() => ID)
  employeeId: string;

  @Field(() => ID)
  projectId: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  hours: number;
}

@ObjectType()
export class RecordWithFavoriteProjectModel extends ProjectModel {
  @Field()
  isFavorite: Boolean;

  @Field()
  hours: Number;
}
