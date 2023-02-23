import { InputType, Field } from "@nestjs/graphql";

/**
 * input type for adding new employee
 */

@InputType()
export class EmployeeCreateInput {

    @Field()
    name: string

    @Field()
    email: string

    @Field()
    rate: number

    @Field({nullable: true})
    status: string | null
}