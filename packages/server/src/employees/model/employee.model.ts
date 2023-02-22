import { ObjectType, Field, ID} from '@nestjs/graphql';

/**
 * return types for querying employee
 */

@ObjectType()
export class EmployeeModel {
    @Field(() => ID)
    id: string;

    @Field()
    email: string;

    @Field()
    name: string;

    @Field()
    rate: number;

    @Field({nullable: true})
    status?: string;

}