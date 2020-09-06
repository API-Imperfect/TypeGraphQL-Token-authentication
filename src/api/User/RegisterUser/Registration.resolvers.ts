import { Arg, Mutation, Resolver } from "type-graphql";
import { RegistrationResponse } from "./RegistrationResponse";
import { RegistrationInput } from "./RegistrationInput";
import { User } from "../../../entity/User";
import { sendEmail } from "../../../utils/sendEmail";
import { createConfirmationUrl } from "../../../utils/createConfirmationUrl";


@Resolver()
export class RegistrationResolvers {
    @Mutation(() => RegistrationResponse)
    async registerUser(
        @Arg("input")
        { firstName, lastName, password, email }: RegistrationInput
    ): Promise<RegistrationResponse> {
        try {
            const user = await User.create({
                firstName,
                lastName,
                email,
                password,
            }).save();

            //send confirmation email upon registration
            await sendEmail(
                email,
                "Confirm Your account",
                await createConfirmationUrl(user.id)
            );

            return {
                status: 201,
                success: true,
                user
            };
        } catch (error) {
            return {
                status: 400,
                success: false,
            };
        }
    }
}
