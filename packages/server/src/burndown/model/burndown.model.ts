import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Burndown {
  @Field()
  date: Date;

  @Field()
  hours: number;

}
