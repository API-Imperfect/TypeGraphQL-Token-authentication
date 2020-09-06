import { Field, Int, ObjectType } from "type-graphql";
import { User } from "../../../entity/User";

@ObjectType({ description: "User Registration response object" })
export class RegistrationResponse {
    @Field(() => Int) status: number;

    @Field() success: boolean;

    @Field() user?: User
}
