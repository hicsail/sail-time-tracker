import { Field, InputType } from "@nestjs/graphql";


/**
 * input type for adding new project
 */
@InputType()
export class ProjectCreateInput {
    @Field()
    name: string

    @Field()
    status: string
}