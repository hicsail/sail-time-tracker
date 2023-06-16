import { ObjectType, Field } from '@nestjs/graphql';
import { ProjectModel } from '../../project/model/project.model';
import { CommentModel } from '../../comments/model/comments.model';

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
  @Field(() => ProjectModel)
  project: ProjectModel;
}

@ObjectType()
export class InvoiceModelWithProjectAndComments extends InvoiceModelWithProject {
  @Field(() => [CommentModel])
  comments: CommentModel[];
}
