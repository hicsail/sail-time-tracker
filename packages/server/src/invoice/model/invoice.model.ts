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

@ObjectType()
export class ListCustomFieldTypeConfig {
  @Field(() => [ListCustomFieldTypeConfigOptions], { nullable: true })
  options?: ListCustomFieldTypeConfigOptions[];
}

@ObjectType()
export class ListCustomFieldTypeConfigOptions {
  @Field()
  id: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Number, { nullable: true })
  orderindex?: number;

  @Field(() => String, { nullable: true })
  label?: string;
}

@ObjectType()
export class ListCustomField {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  type: string;

  @Field()
  type_config: ListCustomFieldTypeConfig;

  @Field(() => Boolean, { nullable: true })
  required: boolean | null;
}
