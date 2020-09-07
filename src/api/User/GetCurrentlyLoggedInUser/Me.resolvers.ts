import { Ctx, Query, Resolver } from "type-graphql";
import { User } from "../../../entity/User";
import { MyContext } from "../../../MyContext";
import { verify } from "jsonwebtoken";

@Resolver()
export class MeResolvers {
    @Query(() => User, { nullable: true })
    async me(@Ctx() context: MyContext) {
        const authorization = context.req.headers["authorization"];

        if (!authorization) {
            return null;
        }

        try {
            const token = authorization.split(" ")[1];
            const payload: any = verify(token, process.env.ACCESS_TOKEN!);
            return await User.findOne(payload.userId);
        } catch (err) {
            console.log(err);
            return null;
        }
    }
}
