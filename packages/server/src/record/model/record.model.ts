import { ObjectType, Field, ID } from '@nestjs/graphql';
import { EmployeeModel } from '../../employees/model/employee.model';
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

@ObjectType()
export class RecordModel extends RecordInsertOrUpdateModel {
  @Field(() => EmployeeModel)
  employee: EmployeeModel;

  @Field(() => ProjectModel)
  project: ProjectModel;
}
