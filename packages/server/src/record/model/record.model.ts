import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ProjectModel } from '../../project/model/project.model';
import { EmployeeModel } from '../../employees/model/employee.model';

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
export class RecordModelWithProject {
  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  hours: number;

  @Field()
  project: ProjectModel;
}

@ObjectType()
export class RecordModelWithEmployee {
  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  hours: number;

  @Field()
  employee: EmployeeModel;
}

@ObjectType()
export class RecordWithFavoriteProjectModel extends ProjectModel {
  @Field()
  isFavorite: Boolean;

  @Field()
  hours: number;

  @Field()
  previousWeek: number;
}
