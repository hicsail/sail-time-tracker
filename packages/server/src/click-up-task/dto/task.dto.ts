import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import JSON from 'graphql-type-json';

@InputType()
export class ClickUpTaskInput {
  @Field()
  @IsString()
  id: string;

  @Field()
  @IsString()
  url: string;
}

@InputType()
export class ClickUpTaskCreateInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  description: string;

  @Field()
  @IsNumber()
  status: number;

  @Field(() => [ClickUpTaskCustomFieldsInput])
  custom_fields: ClickUpTaskCustomFieldsInput[];
}

@InputType()
export class ClickUpTaskCustomFieldsInput {
  @Field()
  @IsString()
  id: string;

  @Field(() => JSON, { nullable: true })
  @IsOptional()
  value: any;
}
