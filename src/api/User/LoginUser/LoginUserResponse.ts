import { Field, Int, ObjectType } from "type-graphql";
import { User } from "../../../entity/User";

@ObjectType({ description: "Log In response object" })
export class LoginUserResponse {
    @Field(() => Int) status: number;

    @Field() success: boolean;

    @Field(() => String, { nullable: true }) error?: string | null;

    @Field(() => String, { nullable: true }) token: string | null;

    @Field() user?: User
}
