import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Burndown {
  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  hours: number;
}
