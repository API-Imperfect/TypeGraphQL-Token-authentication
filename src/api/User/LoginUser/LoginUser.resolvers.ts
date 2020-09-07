import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { User } from "../../../entity/User";
import { LoginUserResponse } from "./LoginUserResponse";
import {
    createAccessToken,
    createRefreshToken,
    storeTokenInCookie,
} from "../../../utils/createJWT";
import { LoginInput } from "./LoginInput";
import { MyContext } from "../../../MyContext";

@Resolver()
export class LoginUserResolvers {
    @Mutation(() => LoginUserResponse)
    async loginUser(
        @Arg("input") { email, password }: LoginInput,
        @Ctx() { res }: MyContext
    ): Promise<LoginUserResponse> {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return {
                    success: false,
                    status: 401,
                    error: "Invalid Login credentials provided",
                    token: null,
                };
            }

            if (!user.confirmed) {
                return {
                    success: false,
                    status: 401,
                    error: "Confirm your email first before logging in",
                    token: null,
                };
            }

            const matchPassword = await user.comparePassword(password);
            if (matchPassword) {
                const token = createAccessToken(user);

                //store token in cookie with refresh token
                storeTokenInCookie(res, createRefreshToken(user));

                return {
                    success: true,
                    status: 200,
                    token,
                    user
                };
            } else {
                return {
                    success: false,
                    status: 401,
                    error: "Invalid Login credentials provided",
                    token: null,
                };
            }
        } catch (error) {
            return {
                success: false,
                status: 400,
                error: error.message,
                token: null,
            };
        }
    }
}
