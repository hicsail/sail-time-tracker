import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CommentModel {
  @Field()
  commentId: string;

  @Field()
  createDate: Date;

  @Field()
  modifiedDate: Date;

  @Field()
  content: string;

  @Field()
  invoiceId: string;
}
