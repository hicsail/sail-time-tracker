import { ObjectType, Field } from '@nestjs/graphql';
import { ProjectModel } from '../../project/model/project.model';

/**
 * return types for querying employee
 */

@ObjectType()
export class InvoiceModel {
  @Field()
  projectId: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  rate: number;

  @Field()
  hours: number;

  @Field()
  amount: number;
}

@ObjectType()
export class InvoiceModelWithProject extends InvoiceModel {
  @Field(() => ProjectModel)
  project: ProjectModel;
}
