import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CommentCreateInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  content: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  invoiceId: string;
}

@InputType()
export class CommentUpdateInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  commentId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  content: string;
}
