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

  @Field()
  isBillable: boolean;

  @Field()
  rate: number;

  @Field()
  fte: number;
}

@ObjectType()
export class ContractTypeModel {
  @Field()
  id: number;

  @Field()
  name: string;
}

@ObjectType()
export class ProjectWithContractType extends ProjectModel {
  @Field(() => ContractTypeModel)
  contractType: ContractTypeModel;
}

@ObjectType()
export class ProjectDeleteReturnModel {
  @Field()
  count: number;
}
