import { Field, Int, ObjectType } from "type-graphql";

@ObjectType({ description: "Log In response object" })
export class LoginUserResponse {
    @Field(() => Int) status: number;

    @Field() success: boolean;

    @Field(() => String, { nullable: true }) error?: string | null;

    @Field(() => String, { nullable: true }) token: string | null;
}
