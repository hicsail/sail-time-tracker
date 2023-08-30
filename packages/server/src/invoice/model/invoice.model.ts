import { ObjectType, Field } from '@nestjs/graphql';
import { ProjectModel, ProjectWithContractType } from '../../project/model/project.model';
import { CommentModel } from '../../comments/model/comments.model';
import { ClickUpTaskModel } from '../../click-up-task/model/task.model';
import { EmployeeModel } from '../../employees/model/employee.model';

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

  @Field()
  invoiceId: string;
}

@ObjectType()
export class InvoiceModelWithProject extends InvoiceModel {
  @Field(() => ProjectWithContractType, { nullable: true })
  project?: ProjectWithContractType;
}

@ObjectType()
export class InvoiceItemModel {
  @Field()
  invoiceId: string;

  @Field()
  employee: EmployeeModel;

  @Field()
  workHours: number;

  @Field()
  indirectHours: number;

  @Field()
  billableHours: number;

  @Field()
  rate: number;

  @Field()
  amount: number;
}

@ObjectType()
export class InvoiceModelWithProjectAndComments extends InvoiceModelWithProject {
  @Field(() => [CommentModel], { nullable: true })
  comments?: CommentModel[];

  @Field(() => ClickUpTaskModel, { nullable: true })
  clickUpTask?: ClickUpTaskModel;

  @Field(() => [InvoiceItemModel], { nullable: true })
  items?: InvoiceItemModel[];
}
