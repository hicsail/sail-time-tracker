import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ClickUpTaskModel {
  @Field()
  id: string;

  @Field()
  url: string;
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

@ObjectType()
export class ClickUpStatuses {
  @Field()
  id: string;

  @Field()
  status: string;

  @Field()
  orderindex: number;

  @Field()
  color: string;

  @Field()
  type: string;
}
