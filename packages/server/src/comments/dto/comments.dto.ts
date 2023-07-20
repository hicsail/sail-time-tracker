import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  deletable?: boolean;
}
